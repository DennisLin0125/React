import React, { Component } from 'react'
import './index.css'

export default class Item extends Component {

  state = {mouse: false};

  handleMouse = (flag) => {
    return () => {
      this.setState({mouse: flag});
    }
  }

  render() {

    const {name,done} = this.props;

    const {mouse} = this.state;

    return (
      <li style={{backgroundColor: mouse ? '#ddd': 'white'}} onMouseLeave={this.handleMouse(false)} onMouseEnter={this.handleMouse(true)}>
        <label>
          <input type="checkbox" defaultChecked={done}/>
          <span>{name}</span>
        </label>
        <button className="btn btn-danger" style={{display: mouse ? "block" : "none"}}>删除</button>
      </li>
    )
  }
}
