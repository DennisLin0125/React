import React, { Component } from 'react'

import Search from './components/Search'
import List from './components/List'

export default class App extends Component {

  // 初始化狀態
  state = {
    users: [],       // users初始為數組
    isFirst: true,   //是否為第一次打開頁面
    isLoading: false, //是否為加載中
    errMsg: ""
  }

  updateAppState = (stateObj) => {
    this.setState(stateObj)
  }

  render() {

    return (
    <div className="container">
      <Search updateAppState={this.updateAppState}/>
      <List {...this.state}/>
    </div>
    )
  }
}
