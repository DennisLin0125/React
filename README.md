# 求和案例_redux精簡版

### 去除Count組件自身的狀態

### src下建立

* redux
    * `store.js`
    * `count_reducer.js`

### store.js

* 引入redux中的createStore函數，建立一個store
* createStore呼叫時要傳入一個為其服務的reducer
* 記得暴露`store`對象

```js
import { configureStore } from '@reduxjs/toolkit';  // npm install @reduxjs/toolkit
import countReducer from './count_reducer';

const store = configureStore({
  reducer: {
    count: countReducer
  }
});

export default store;
```

### count_reducer.js

* reducer的本質是一個函數，接收：`preState`,`action`，傳回加工後的狀態
* reducer有兩個作用：
  * 初始化狀態
  * 加工狀態
* reducer被第一次呼叫時，是store自動觸發的，
  * 傳遞的preState是`undefined`
  * 傳遞的action是:{type:'@@REDUX/INIT_a.2.b.4}

```js
export default function countReducer(preState = 0, action) {
    const { type, data } = action;
    switch (type) {
        case 'increment':
            return preState + data;
        case 'decrement':
            return preState - data;
        default:
            return preState;
    }
}
```

### 在index.js中監控store狀態的改變，一旦發生改變重新渲染`<App/>`

```js
  // 監測redux中的狀態變化,只要變化,就調用render
store.subscribe(() => {
    root.render(
        <React.StrictMode>
        <App />
        </React.StrictMode>
    );  
})
```

#### 備註：redux只負責管理狀態，至於狀態的改變驅動著頁面的展示，要靠我們自己寫

```js
componentDidMount() {
    // 監測redux中的狀態變化,只要變化,就調用render
    store.subscribe(() => {
        this.setState({});
    })
}
```
