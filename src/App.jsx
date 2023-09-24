import React, { Component } from 'react'

import Header from "./componets/Header"
import List from "./componets/List"
import Footer from "./componets/Footer"
import "./App.css"

export default class App extends Component {

  // 初始化狀態
  state={ todos: [
    {id: '001',name: '吃飯', done: true},
    {id: '002',name: '睡覺', done: true},
    {id: '003',name: '打程式', done: false},
    {id: '004',name: '逛街', done: true},
  ]}

  render() {
    const {todos} = this.state;

    return (
      <div className="todo-container">
        <div className="todo-wrap">
          <Header/>
          <List todos={todos}/>
          <Footer/>
        </div>
      </div>
    )
  }
}
