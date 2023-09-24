import React, { Component } from 'react'
import './index.css'

export default class Item extends Component {

  state = {mouse: false};

  handleMouse = (flag) => {
    return () => {
      this.setState({mouse: flag});
    }
  }

  // 勾選或取消勾選todo的回調
  handleCheck = (id) => {
    return (event) => {
      // console.log(id,event.target.checked);
      this.props.updateTodo(id,event.target.checked);
    }
  }

  // 刪除一個todo的回調
  handleDelect = (id) => {
    // console.log(id);
    if (window.confirm('確定刪除嗎?')) {
      this.props.deleteTodo(id);
    }
  }

  render() {

    const {id,name,done} = this.props;

    const {mouse} = this.state;

    return (
      <li style={{backgroundColor: mouse ? '#ddd': 'white'}} onMouseLeave={this.handleMouse(false)} onMouseEnter={this.handleMouse(true)}>
        <label>
          <input type="checkbox" defaultChecked={done} onChange={this.handleCheck(id)}/>
          <span>{name}</span>
        </label>
        <button onClick={()=>{this.handleDelect(id)}} className="btn btn-danger" style={{display: mouse ? "block" : "none"}}>删除</button>
      </li>
    )
  }
}
