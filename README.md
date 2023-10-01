# 求和案例_React-redux基本使用

## 明確兩個概念：

* UI元件:不能使用任何redux的api，只負責頁面的呈現、互動等。
* 容器元件：負責和redux通信，將結果交給UI元件。

## 如何建立一個容器元件 —— 靠react-redux 的 connect函數

* connect(`mapStateToProps`,`mapDispatchToProps`)(UI元件)

```js
// 引入connect
import { connect } from 'react-redux'

import CountUI from '../../componets/Count'

const CountContainer = connect(mapStateToProbs, mapDispatchToProbs)(CountUI);
export default CountContainer;
```

* mapStateToProps:映射狀態，回傳值是一個對象

```js
function mapStateToProbs(state) {
    return { count: state.count }
}
```

* mapDispatchToProps:映射操作狀態的方法，傳回值是一個對象

```js
import {
    createIncrementAction,
    createDecrementAction,
    createIncrementAsyncAction
} from '../../redux/count_action'

function mapDispatchToProbs(dispatch) {
    return {
        add: (data) => dispatch(createIncrementAction(data)),
        sub: (data) => dispatch(createDecrementAction(data)),
        async: (data, time) => dispatch(createIncrementAsyncAction(data, time)),
    }
}
```

### 備註1：容器組件中的store是靠props傳進去的，而不是在容器組件中直接引入

```js
import store from './redux/store'

export default class App extends Component {
  render() {
    return (
      <div>
        <Count store={store}/>
      </div>
    )
  }
}
```

### 備註2：mapDispatchToProps，也可以是一個對象

## 求和案例_react-redux優化
* 容器元件和UI元件整合一個文件
* 不需要自己給容器元件傳遞store，給`<App/>`包裹一個`<Provider store={store}>`即可。
* 使用了`react-redux`後也不用再自己偵測redux中狀態的改變了，容器元件可以自動完成這個工作。
* mapDispatchToProps也可以簡單的寫成一個對象
* 一個元件要和redux「打交道」要經過哪幾步？
  1. 定義好UI元件---不暴露
  2. 引入connect產生一個容器組件，並暴露，寫法如下：

```js
connect(
  state => ({key:value}), //映射狀態
  {key:xxxxxAction} //映射操作狀態的方法
)(UI組件)

```

### 在UI元件中透過this.props.xxxxxxx讀取和操作狀態

## 求和案例_react-redux資料共享版

1. 定義一個Pserson組件，和Count組件透過redux共享資料。
2. 為Person組件編寫：reducer、action，配置constant常數。
3. 交給store的是總reducer，最後注意在組件中取出狀態的時候，記得「取到位」。