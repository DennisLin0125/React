// 引入React 核心庫
import React from 'react';
// 引入ReactDOM
import ReactDOM from 'react-dom/client';
// 引入App組件
import App from "./App"

import store from './redux/store'

// 渲染app組件到頁面
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // 監測redux中的狀態變化,只要變化,就調用render
store.subscribe(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );  
})