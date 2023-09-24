import React, { Component } from 'react'
import "./index.css"

import Item from "../Item"

export default class List extends Component {

  render() {

    const {todos} = this.props
    return (
      <ul className="todo-main">
        {
          todos.map((todo) => {
            // return <Item key={todo.id} id={todo.id} name={todo.name} done={todo.done}/>;
            return <Item key={todo.id} {...todo}/>;
          })
        }
      </ul>
    )
  }
}
