import React, { Component } from 'react'

import Header from "./componets/Header"
import List from "./componets/List"
import Footer from "./componets/Footer"
import "./App.css"

export default class App extends Component {

  // 初始化狀態
  state = { todos: [
    {id: '001',name: '吃飯', done: true},
    {id: '002',name: '睡覺', done: true},
    {id: '003',name: '打程式', done: false},
    {id: '004',name: '逛街', done: true},
  ]};

  //  addTodo用於添加一個todo ,接收的參數是todo json
  addTodo = (todoObj) => {
    console.log("ok",todoObj);
    // 1. 獲取原todos
    const {todos} = this.state;
    // 2. 追加一個todo
    const newTodos = [todoObj,...todos];
    // 3.更新狀態
    this.setState({todos: newTodos});
  }

  // 用於更新是否點擊checkbox的狀態
  updateTodo = (id, done) => {
    // 獲取狀態中的todos
    const {todos} = this.state;
    // 匹配處理數據
    const newTodos = todos.map((todoObj) => {
      if (todoObj.id === id) {
        return {...todoObj, done:done}
      }else{
        return todoObj;
      }
    });
    this.setState({todos: newTodos});
  }

  // 刪除todo
  deleteTodo = (id) => {
    // 獲取狀態中的todos
    const {todos} = this.state;
    // 刪除指定id的todo對象
    const newTodos = todos.filter((todoObj)=>{
      return todoObj.id !== id;
    });
    // 更新狀態
    this.setState({todos: newTodos});
  }

  // 用於全選
  checkAllTodo = (done) => {
    // 獲取狀態中的todos
    const {todos} = this.state;
    const newTodos = todos.map((todoObj)=>{
      return {...todoObj,done:done}
    })
    // 更新狀態
    this.setState({todos: newTodos});
  }

  // 清除所有已完成的
  ClearAllDone = () => {
    // 獲取狀態中的todos
    const {todos} = this.state;
    const newTodos = todos.filter((todoObj) => {
      return !todoObj.done
    });
    // 更新狀態
    this.setState({todos: newTodos});
  }

  render() {
    const {todos} = this.state;

    return (
      <div className="todo-container">
        <div className="todo-wrap">
          <Header addTodo={this.addTodo}/>
          <List todos={todos} updateTodo={this.updateTodo} deleteTodo={this.deleteTodo}/>
          <Footer todos={todos} checkAllTodo={this.checkAllTodo} ClearAllDone={this.ClearAllDone}/>
        </div>
      </div>
    )
  }
}
