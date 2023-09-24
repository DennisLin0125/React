# React腳手架配置代理總結

## 方法一

> 在package.json中追加如下配置

```json
"proxy":"http://localhost:5000"
```

說明：

1. 優點：配置簡單，前端請求資源時可以不加任何前綴。
2. 缺點：不能配置多個代理程式。
3. 工作方式：上述方式配置代理，當請求了3000不存在的資源時，那麼該請求會轉送給5000 （優先匹配前端資源）

## 方法二

1. 第一步：建立代理設定文件

```
在src下建立設定檔：src/setupProxy.js
```

2. 撰寫setupProxy.js配置具體代理程式規則：

```js
const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function(app){
    app.use(
        '/students',
        createProxyMiddleware({
            target:'http://localhost:5000',  //設定轉送目標位址(能傳回資料的伺服器位址)
            changeOrigin:true,  //控制伺服器接收到的請求頭中host欄位的值
        })
    );

    /*
          changeOrigin設定為true時，伺服器收到的請求頭中的host為：localhost:5000
          changeOrigin設定為false時，伺服器收到的請求頭中的host為：localhost:3000
          changeOrigin預設值為false，但我們一般將changeOrigin值設為true
    */
    

    app.use(
        '/cars',
        createProxyMiddleware({
            target:'http://localhost:5001',
            changeOrigin:true,
        })
    );
}
```

說明：

1. 優點：可以設定多個代理，可以靈活的控制請求是否走代理。
2. 缺點：配置繁瑣，前端請求資源時必須加前綴。
