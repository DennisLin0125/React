# 求和案例_redux非同步action版

## 明確：延遲的動作不想交給組件自身，想交給action

## 何時需要非同步action

* 想要對狀態進行操作，但是具體的資料靠非同步任務返回。

## 具體編碼

* 創建action的函數不再傳回一般對象，而是一個函數，該函數中寫非同步任務。
* 非同步任務有結果後，分發一個同步的action去真正操作資料。

```js
// 所謂的異步Actoin就是回傳為function
export const createIncrementAsyncAction = (data,time) => { 
    return (dispatch) => {
        setTimeout(() => {
            dispatch(createIncrementAction(data))
        },time)
    }
}
```

* 備註：非同步action不是必須要寫的，完全可以自己等待非同步任務的結果了再去分發同步action。
