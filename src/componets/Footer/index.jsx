import React, { Component } from 'react'
import './index.css'

export default class Footer extends Component {

  // 全選checkbox的回調
  handleCheckAll = (event) => {
    this.props.checkAllTodo(event.target.checked);
  }

  // 清除所有已完成的回調
  handleClearAll = () => {
    this.props.ClearAllDone();
  }

  render() {
    const { todos } = this.props;

    // 計算一下有幾個已完成
    const doneCount = todos.reduce((previousValue,currentValue) => {
      const {done} = currentValue;
      return previousValue + (done? 1 : 0);
    },0);

    // 總數
    const total = todos.length;

    return (
      <div className="todo-footer">
        <label>
          <input type="checkbox" onChange={this.handleCheckAll} checked={doneCount === total && total !== 0 ? true : false}/>
        </label>
        <span>
          <span>已完成{doneCount}</span> / 全部{total}
        </span>
        <button onClick={this.handleClearAll} className="btn btn-danger">清除已完成任務</button>
      </div>
    )
  }
}
