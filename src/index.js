// 引入React 核心庫
import React from 'react';
// 引入ReactDOM
import ReactDOM from 'react-dom/client';
// 引入Router
import {BrowserRouter} from 'react-router-dom'
// 引入App組件
import App from "./App"

// 渲染app組件到頁面
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );