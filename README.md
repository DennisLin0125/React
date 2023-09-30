# 求和案例_redux完整版

## 新增檔案：

* count_action.js 專門用於建立action對象

```js
import {INCREMENT,DECREMENT} from '../redux/constant'

export const createIncrementAction = (data) => ({ type: INCREMENT, data: data })
export const createDecrementAction = (data) => ({ type: DECREMENT, data: data })


```

* constant.js 放置容易寫錯的type值

```js
export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';
```