import React, { Component } from 'react'
import { nanoid } from 'nanoid'

import "./index.css"

export default class Header extends Component {

  handleKeyUp = (event) => {

    const { keyCode, target } = event
  
    // 獲得輸入按鍵的ASCII code 如果不是按Enter,就停止
    if (keyCode !== 13) return;

    // 添加的物件不能為空
    if (target.value.trim() === '') {
      alert("輸入不能為空~~!");
      return;
    }

    // 輸出上方輸入框輸入的訊息 
    console.log(target.value);

    // 準備好一個todo json
    const todoObj = {id: nanoid(),name: target.value ,done: false};

    // 將todoObj回傳給App.jsx
    this.props.addTodo(todoObj);

    // 清空輸入框
    target.value = '';
  }

  render() {
    return (
      <div className="todo-header">
        <input onKeyUp={this.handleKeyUp} type="text" placeholder="請輸入你的任務名稱，按Enter鍵確認"/>
      </div>
    )
  }
}
