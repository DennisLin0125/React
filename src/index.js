// 引入React 核心庫
import React from 'react';
// 引入ReactDOM
import ReactDOM from 'react-dom/client';
// 引入App組件
import App from "./App.js"

// 渲染app組件到頁面
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );