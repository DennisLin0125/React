'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const resolve = require('resolve');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const ESLintPlugin = require('eslint-webpack-plugin');
const paths = require('./paths');
const modules = require('./modules');
const getClientEnvironment = require('./env');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin =
  process.env.TSC_COMPILE_ON_ERROR === 'true'
    ? require('react-dev-utils/ForkTsCheckerWarningWebpackPlugin')
    : require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const createEnvironmentHash = require('./webpack/persistentCache/createEnvironmentHash');

// 來源映射佔用大量資源，可能導致大型來源檔案出現記憶體不足問題.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const reactRefreshRuntimeEntry = require.resolve('react-refresh/runtime');
const reactRefreshWebpackPluginRuntimeEntry = require.resolve(
  '@pmmmwh/react-refresh-webpack-plugin'
);
const babelRuntimeEntry = require.resolve('babel-preset-react-app');
const babelRuntimeEntryHelpers = require.resolve(
  '@babel/runtime/helpers/esm/assertThisInitialized',
  { paths: [babelRuntimeEntry] }
);
const babelRuntimeRegenerator = require.resolve('@babel/runtime/regenerator', {
  paths: [babelRuntimeEntry],
});

// 某些應用程式不需要保存 Web 請求的好處，因此不需要內聯區塊
// 使建置過程更加順利。
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';

const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';
const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);

// 檢查 TypeScript 是否已設定
const useTypeScript = fs.existsSync(paths.appTsConfig);

// 檢查 Tailwind 配置是否存在
const useTailwind = fs.existsSync(
  path.join(paths.appPath, 'tailwind.config.js')
);

// 取得未編譯的 Service Worker 的路徑（如果存在）。
const swSrc = paths.swSrc;

// 樣式文件正規表示式
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

/*
這是生產和開發配置。
它專注於開發人員體驗、快速重建和最小捆綁。
 */
module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  // 用於生產中啟用分析的變數
  // 傳入別名物件。 如果傳遞到建置命令中則使用標誌
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes('--profile');

  // 我們將為我們的應用程式提供 `paths.publicUrlOrPath`
   // 在 JavaScript 中作為 `index.html` 和 `process.env.PUBLIC_URL` 中的 %PUBLIC_URL%。
   // 省略尾部斜杠，因為 %PUBLIC_URL%/xyz 看起來比 %PUBLIC_URL%xyz 更好。
   // 取得要注入到我們的應用程式中的環境變數。
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

  const shouldUseReactRefresh = env.raw.FAST_REFRESH;

  // 取得樣式載入器的常用函數
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        // css位於`static/css`中，使用'../../'定位index.html資料夾
        // 在生產環境中 `paths.publicUrlOrPath` 可以是相對路徑
        options: paths.publicUrlOrPath.startsWith('.')
          ? { publicPath: '../../' }
          : {},
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // PostCSS 的選項，因為我們兩次引用這些選項
        // 根據您指定的瀏覽器支援新增供應商前綴
        // 套件.json
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            // 外部 CSS 導入工作所必需的
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            config: false,
            plugins: !useTailwind
              ? [
                  'postcss-flexbugs-fixes',
                  [
                    'postcss-preset-env',
                    {
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    },
                  ],
                  // 新增 PostCSS Normalize 作為具有預設選項的重置 css，
                  // 以便它遵循 package.json 中的 browserslist 配置
                  // 這又讓使用者可以依照自己的需求自訂目標行為。
                  'postcss-normalize',
                ]
              : [
                  'tailwindcss',
                  'postcss-flexbugs-fixes',
                  [
                    'postcss-preset-env',
                    {
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    },
                  ],
                ],
          },
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            root: paths.appSrc,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
          },
        }
      );
    }
    return loaders;
  };

  return {
    target: ['browserslist'],
    // Webpack 噪音僅限於錯誤和警告
    stats: 'errors-warnings',
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    // 在生產早期停止編譯
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    // 這些是我們應用程式的「入口點」。
    // 這表示它們將是包含在 JS 包中的「根」導入。
    entry: paths.appIndexJs,
    output: {
      // 建置資料夾。
      path: paths.appBuild,
      // 將 /* filename */ 註解加入輸出中產生的 require() 中。
      pathinfo: isEnvDevelopment,
      // 將有一個主包，每個非同步區塊一個檔案。
      // 在開發中，它不會產生真實的檔案。
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/bundle.js',
      // 如果您使用程式碼分割，這裡還有額外的 JS 區塊檔案。
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      // webpack 使用「publicPath」來決定應用程式的服務位置。
      // 它需要尾部斜杠，否則檔案資產將獲得錯誤的路徑。
      // 我們從主頁推斷「公共路徑」（例如 / 或 /my-project）。
      publicPath: paths.publicUrlOrPath,
      // 將來源對應項目指向原始磁碟位置（在 Windows 上格式為 URL）
      devtoolModuleFilenameTemplate: isEnvProduction
        ? info =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, '/')
        : isEnvDevelopment &&
          (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    },
    cache: {
      type: 'filesystem',
      version: createEnvironmentHash(env.raw),
      cacheDirectory: paths.appWebpackCache,
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsconfig: [paths.appTsConfig, paths.appJsConfig].filter(f =>
          fs.existsSync(f)
        ),
      },
    },
    infrastructureLogging: {
      level: 'none',
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        // 這僅用於生產模式
        new TerserPlugin({
          terserOptions: {
            parse: {
              // 我們希望 terser 能夠解析 ecma 8 程式碼。 然而，我們不想要它
              // 應用任何可轉換為有效 ecma 5 程式碼的縮小步驟
              // 進入無效的 ECMA 5 碼。 這就是為什麼“壓縮”和“輸出”
              // 部分僅套用 ecma 5 安全的轉換
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // 由於 Uglify 的問題破壞了看似有效的程式碼而被停用：
              // https://github.com/facebook/create-react-app/issues/2376
              // 等待進一步調查：
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // 由於 Terser 破壞有效程式碼的問題而被停用：
              // https://github.com/facebook/create-react-app/issues/5250
              // P結束進一步調查：
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // 添加用於在開發工具中進行分析
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              // 啟用是因為表情符號和正規表示式未使用預設值正確縮小
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),
        // 這僅用於生產模式
        new CssMinimizerPlugin(),
      ],
    },
    resolve: {
      // 這允許您設定 webpack 應該在哪裡尋找模組的後備。
      // 我們將這些路徑放在第二位，因為我們希望“node_modules”“獲勝”
      // 如果有任何衝突。 這與Node解析機制相符。
      // https://github.com/facebook/create-react-app/issues/253
      modules: ['node_modules', paths.appNodeModules].concat(
        modules.additionalModulePaths || []
      ),
      // 這些是 Node 生態系支援的合理預設值。
      // 我們也包含 JSX 作為通用元件檔案副檔名以支援
      // 一些工具，雖然我們不建議使用，請參見：
      // https://github.com/facebook/create-react-app/issues/290
      // 添加了 `web` 擴展前綴以獲得更好的支持
      // 對於 React Native Web。
      extensions: paths.moduleFileExtensions
        .map(ext => `.${ext}`)
        .filter(ext => useTypeScript || !ext.includes('ts')),
      alias: {
        // 支援 React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
        // 允許使用 React DevTools 進行更好的分析
        ...(isEnvProductionProfile && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        }),
        ...(modules.webpackAliases || {}),
      },
      plugins: [
        // 阻止使用者從 src/（或 node_modules/）外部匯入檔案。
        // 這經常會造成混亂，因為我們只使用 babel 來處理 src/ 中的檔案。
        // 為了解決這個問題，我們阻止您從 src/ 匯入檔案—如果您願意的話，
        // 請將檔案連結到您的node_modules/並讓模組解析生效。
        // 確保您的原始檔案已編譯，因為它們不會以任何方式處理。
        new ModuleScopePlugin(paths.appSrc, [
          paths.appPackageJson,
          reactRefreshRuntimeEntry,
          reactRefreshWebpackPluginRuntimeEntry,
          babelRuntimeEntry,
          babelRuntimeEntryHelpers,
          babelRuntimeRegenerator,
        ]),
      ],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // 處理包含來源映射的node_modules包
        shouldUseSourceMap && {
          enforce: 'pre',
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve('source-map-loader'),
        },
        {
          // “oneOf”將遍歷所有後續載入器，直到有一個載入器
          // 符合要求。 當沒有裝載機匹配時它就會掉落
          // 返回載入器清單末端的「檔案」載入器。
          oneOf: [
            // TODO: 一旦 `image/avif` 位於 mime-db 中，就合併此配置
            // https://github.com/jshttp/mime-db
            {
              test: [/\.avif$/],
              type: 'asset',
              mimetype: 'image/avif',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            //“url”載入器的工作方式類似於“file”載入器，只是它嵌入了資產
            // 小於作為資料 URL 指定的位元組限制，以避免請求。
            // 缺少 `test` 相當於符合。
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: require.resolve('@svgr/webpack'),
                  options: {
                    prettier: false,
                    svgo: false,
                    svgoConfig: {
                      plugins: [{ removeViewBox: false }],
                    },
                    titleProp: true,
                    ref: true,
                  },
                },
                {
                  loader: require.resolve('file-loader'),
                  options: {
                    name: 'static/media/[name].[hash].[ext]',
                  },
                },
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },
            // 使用 Babel 處理應用程式 JS。
            // 預設包含 JSX、Flow、TypeScript 和一些 ESnext 功能。
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                customize: require.resolve(
                  'babel-preset-react-app/webpack-overrides'
                ),
                presets: [
                  [
                    require.resolve('babel-preset-react-app'),
                    {
                      runtime: hasJsxRuntime ? 'automatic' : 'classic',
                    },
                  ],
                ],
                
                plugins: [
                  isEnvDevelopment &&
                    shouldUseReactRefresh &&
                    require.resolve('react-refresh/babel'),
                ].filter(Boolean),
                // 這是 webpack 的 `babel-loader` 的特性（不是 Babel 本身）。
                // 它啟用在 ./node_modules/.cache/babel-loader/ 中快取結果
                // 用於更快重建的目錄。
                cacheDirectory: true,
                // 有關為什麼要停用快取壓縮的上下文，請參閱#6846
                cacheCompression: false,
                compact: isEnvProduction,
              },
            },
            // 使用 Babel 處理應用程式外部的任何 JS。
            // 與應用程式 JS 不同，我們只編譯標準 ES 功能。
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [
                  [
                    require.resolve('babel-preset-react-app/dependencies'),
                    { helpers: true },
                  ],
                ],
                cacheDirectory: true,
                // 有關停用快取壓縮的原因，請參閱#6846
                cacheCompression: false,
                
                // 偵錯 node_modules 需要 Babel 來源映射
                // 程式碼。 如果沒有以下選項，VSCode 等調試器
                // 顯示不正確的程式碼並在錯誤的行上設定斷點。
                sourceMaps: shouldUseSourceMap,
                inputSourceMap: shouldUseSourceMap,
              },
            },
            // “postcss”載入器將 autoprefixer 套用到我們的 CSS。
            // “css”載入器解析 CSS 中的路徑並將資源新增為依賴項。
            // “style”載入器將 CSS 轉換為注入 <style> 標籤的 JS 模組。
            // 在生產中，我們使用 MiniCSSExtractPlugin 來擷取 CSS
            // 到一個文件，但在開發中「樣式」載入器啟用熱編輯
            // CSS 的。
            // 預設情況下，我們支援擴展名為 .module.css 的 CSS 模組
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                modules: {
                  mode: 'icss',
                },
              }),
              // 不要認為 CSS 導入了死代碼，即使
              // 包含聲稱沒有副作用的套件。
              // 當 webpack 新增警告或錯誤時刪除它。
              // 請參閱 https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // 新增 CSS 模組的支援 (https://github.com/css-modules/css-modules)
            // 使用副檔名.module.css
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                modules: {
                  mode: 'local',
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              }),
            },
            // 選擇支援 SASS（使用 .scss 或 .sass 副檔名）。
            // 預設情況下，我們支援 SASS 模組
            // 副檔名 .module.scss 或 .module.sass
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: 'icss',
                  },
                },
                'sass-loader'
              ),
              // 不要認為 CSS 導入了死代碼，即使
              // 包含聲稱沒有副作用的套件。
              // 當 webpack 新增警告或錯誤時刪除它。
              // 請參閱 https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // 新增對 CSS 模組的支持，但使用 SASS
            // 使用副檔名 .module.scss 或 .module.sass
            {
              test: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: 'local',
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
                'sass-loader'
              ),
            },
            // 「檔案」載入器確保這些資源由 WebpackDevServer 提供服務。
            // 當您「匯入」資產時，您將獲得其（虛擬）檔案名稱。
            // 在生產中，它們將被複製到「build」資料夾中。
            // 該載入器不使用“測試”，因此它將捕獲所有模組
            // 透過其他載入器。
            {
              // 排除 `js` 檔案以保持「css」載入器在註入時正常運作
              // 它的運行時否則將透過「檔案」載入器處理。
              // 也要排除 `html` 和 `json` 副檔名，以便它們被處理
              // 透過 webpacks 內部載入器。
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
            },
            // ** 停止 ** 您是否要新增新的載入程式？
            // 確保在「檔案」載入器之前新增載入器。
          ],
        },
      ].filter(Boolean),
    },
    plugins: [
      // 產生一個包含 <script> 注入的 `index.html` 檔案。
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: paths.appHtml,
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      // 內嵌 webpack 執行階段腳本。 這個腳本太小了，無法保證
      // 網路請求。
      // https://github.com/facebook/create-react-app/issues/5358
      isEnvProduction &&
        shouldInlineRuntimeChunk &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      // 使一些環境變數在index.html 中可用。
      // 公用 URL 在 index.html 中以 %PUBLIC_URL% 形式提供，例如：
      // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
      // 除非您指定“homepage”，否則它將是一個空字串
      // 在 `package.json` 中，在這種情況下它將是該 URL 的路徑名稱。
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
      // 這為模組未找到錯誤提供了一些必要的上下文，例如
      // 請求的資源。
      new ModuleNotFoundPlugin(paths.appPath),
      // 使一些環境變數可供 JS 程式碼使用，例如：
      // if (process.env.NODE_ENV === '生產') { ... }. 請參閱“./env.js”。
      // 將 NODE_ENV 設定為生產環境是絕對必要的
      // 在生產建置期間。
      // 否則React將會在非常慢的開發模式下編譯。
      new webpack.DefinePlugin(env.stringified),
      // React 的實驗性熱重載。
      // https://github.com/facebook/react/tree/main/packages/react-refresh
      isEnvDevelopment &&
        shouldUseReactRefresh &&
        new ReactRefreshWebpackPlugin({
          overlay: false,
        }),
      // 如果你在路徑中輸錯了大小寫，那麼 Watcher 就無法正常運作，所以我們使用
      // 當您嘗試執行此操作時會列印錯誤的插件。
      // 請參閱 https://github.com/facebook/create-react-app/issues/240
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          // 與 webpackOptions.output 相同選項類似的選項
          // 兩個選項都是可選的
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
      // 產生資產清單文件，內容如下：
      // - “files”鍵：將所有資源檔案名稱對應到其對應的
      // 輸出文件，以便工具無需解析即可取得它
      // `index.html`
      // - “entrypoints”鍵：包含在 `index.html` 中的檔案數組，
      // 如果需要的話可以用來重建 HTML
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            fileName => !fileName.endsWith('.map')
          );

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
      // Moment.js 是一個非常流行的函式庫，它捆綁了大型語言環境文件
      // 預設情況下，由於 webpack 解釋其程式碼的方式。 這是一個實用的
      // 要求使用者選擇匯入特定區域設定的解決方案。
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // 如果你不使用 Moment.js，你可以刪除它：
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      // 產生一個服務工作執行緒腳本，該腳本將預先快取並保持最新，
      // 作為 webpack 建構一部分的 HTML 和資源。
      isEnvProduction &&
        fs.existsSync(swSrc) &&
        new WorkboxWebpackPlugin.InjectManifest({
          swSrc,
          dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
          exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
          // 增加預先快取的預設最大大小 (2mb)，
          // 減少延遲載入失敗的可能性。
          // 請參閱 https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        }),
      // TypeScript type checking
      useTypeScript &&
        new ForkTsCheckerWebpackPlugin({
          async: isEnvDevelopment,
          typescript: {
            typescriptPath: resolve.sync('typescript', {
              basedir: paths.appNodeModules,
            }),
            configOverwrite: {
              compilerOptions: {
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                skipLibCheck: true,
                inlineSourceMap: false,
                declarationMap: false,
                noEmit: true,
                incremental: true,
                tsBuildInfoFile: paths.appTsBuildInfoFile,
              },
            },
            context: paths.appPath,
            diagnosticOptions: {
              syntactic: true,
            },
            mode: 'write-references',
            // profile: true,
          },
          issue: {
            // 這個是專門為了在 CI 測試期間匹配的，
            // 因為微匹配不匹配
            // '../cra-template-typescript/template/src/App.tsx'
            // 否則。
            include: [
              { file: '../**/src/**/*.{ts,tsx}' },
              { file: '**/src/**/*.{ts,tsx}' },
            ],
            exclude: [
              { file: '**/src/**/__tests__/**' },
              { file: '**/src/**/?(*.){spec|test}.*' },
              { file: '**/src/setupProxy.*' },
              { file: '**/src/setupTests.*' },
            ],
          },
          logger: {
            infrastructure: 'silent',
          },
        }),
      !disableESLintPlugin &&
        new ESLintPlugin({
          // Plugin options
          extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
          formatter: require.resolve('react-dev-utils/eslintFormatter'),
          eslintPath: require.resolve('eslint'),
          failOnError: !(isEnvDevelopment && emitErrorsAsWarnings),
          context: paths.appSrc,
          cache: true,
          cacheLocation: path.resolve(
            paths.appNodeModules,
            '.cache/.eslintcache'
          ),
          // ESLint class options
          cwd: paths.appPath,
          resolvePluginsRelativeTo: __dirname,
          baseConfig: {
            extends: [require.resolve('eslint-config-react-app/base')],
            rules: {
              ...(!hasJsxRuntime && {
                'react/react-in-jsx-scope': 'error',
              }),
            },
          },
        }),
    ].filter(Boolean),
    // 關閉效能處理，因為我們利用
    // 我們自己透過 FileSizeReporter 給出的提示
    performance: false,
  };
};
