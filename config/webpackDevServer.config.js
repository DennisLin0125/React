'use strict';

const fs = require('fs');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('./paths');
const getHttpsConfig = require('./getHttpsConfig');

const host = process.env.HOST || '0.0.0.0';
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/ws'
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = function (proxy, allowedHost) {
  const disableFirewall =
    !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true';
  return {
    /**
     * WebpackDevServer 2.4.3 引入了一個安全修復程序，可防止遠端
     防止網站透過 DNS 重新綁定存取本機內容：
     https://github.com/webpack/webpack-dev-server/issues/887
     https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
     然而，它提出了一些現有的用例，例如雲端開發
     開發中的環境或子域明顯更加複雜：
     https://github.com/facebook/create-react-app/issues/2271
     https://github.com/facebook/create-react-app/issues/2233
     雖然我們正在研究更好的解決方案，但目前我們將採取
     妥協。 由於我們的 WDS 配置僅提供“public”中的文件
     資料夾，我們不會將存取它們視為漏洞。 但是，如果您
     使用“代理”功能，它會變得更加危險，因為它會暴露
     Django 和 Rails 等後端的遠端程式碼執行漏洞。
     因此，我們通常會停用主機檢查，但如果有的話啟用它
     指定“代理”設定。 最後，我們允許您覆蓋它，如果您
     真正知道你在使用特殊的環境變數做什麼。
     注意：[“localhost”，“.localhost”]將支援子網域 - 但我們可能
     想要允許手動設定 allowedHosts 以進行更複雜的設置
     */
    allowedHosts: disableFirewall ? 'all' : [allowedHost],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    // 啟用生成檔案的 gzip 壓縮.
    compress: true,
    static: {
      /**
       * 預設情況下，WebpackDevServer 從目前目錄提供實體文件
       除了它從記憶體提供的所有虛擬建構產品。
       這很令人困惑，因為這些文件不會自動在
       生產建置資料夾，除非我們複製它們。 然而，複製整個
       專案目錄很危險，因為我們可能會暴露敏感檔案。
       相反，我們建立了一個約定，僅將文件放在“public”目錄中
       得到服務。 我們的建置腳本會將「public」複製到「build」資料夾中。
       在 `index.html` 中，您可以使用 %PUBLIC_URL% 取得 `public` 資料夾的 URL：
       <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
       在 JavaScript 程式碼中，您可以使用「process.env.PUBLIC_URL」存取它。
       請注意，我們僅建議使用“public”資料夾作為逃生口
       對於“favicon.ico”、“manifest.json”等檔案以及以下庫
       由於某種原因，透過 webpack 導入時損壞了。 如果你只是想
       使用圖像，將其放入“src”中，然後從 JavaScript“導入”它。
       */
      directory: paths.appPublic,
      publicPath: [paths.publicUrlOrPath],
      // 預設情況下，來自「contentBase」的檔案不會觸發頁面重新載入。
      watch: {
        /**
         * 據報道，這可以避免某些系統上的 CPU 過載。
         https://github.com/facebook/create-react-app/issues/293
         不會忽略 src/node_modules 以支援絕對導入
         https://github.com/facebook/create-react-app/issues/1065
         */
        ignored: ignoredFiles(paths.appSrc),
      },
    },
    client: {
      webSocketURL: {
        /**
         * 啟用自訂 sockjs 路徑名以將 websocket 連接到熱重載伺服器。
         為 websocket 連線啟用自訂 sockjs 主機名稱、路徑名稱和連接埠
         到熱重載伺服器。
         */
        hostname: sockHost,
        pathname: sockPath,
        port: sockPort,
      },
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    devMiddleware: {
      /**
       * 告訴 WebpackDevServer 使用與以下相同的「publicPath」路徑非常重要
       我們在 webpack 配置中指定。 當主頁為“.”時，預設為服務
       從根源。
       刪除最後一個斜杠，以便用戶可以登陸“/test”而不是“/test/”
       */
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },

    https: getHttpsConfig(),
    host,
    historyApiFallback: {
      /**
       * 帶點的路徑仍應使用歷史回退。
       請參閱 https://github.com/facebook/create-react-app/issues/387。
       */
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    // `proxy` 在 `before` 和 `after` `webpack-dev-server` 鉤子之間運行
    proxy,
    onBeforeSetupMiddleware(devServer) {
      /**
       * 保留“evalSourceMapMiddleware”
       `redirectServedPath` 之前的中間件否則不會有任何效果
       這讓我們可以從 webpack 中取得錯誤覆蓋的來源內容
       */
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        // 出於代理原因，這會註冊用戶提供的中間件
        require(paths.proxySetup)(devServer.app);
      }
    },
    onAfterSetupMiddleware(devServer) {
      // 如果 url 不匹配，則從 `package.json` 重新導向到 `PUBLIC_URL` 或 `homepage`
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

      /***
       * 該服務工作者文件實際上是一個“無操作”，它將重置任何
       先前的服務工作人員註冊了相同的主機：連接埠組合。
       我們在開發中這樣做是為了避免在以下情況下存取生產快取：
       它使用相同的主機和連接埠。
       https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
       */
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
    },
  };
};
