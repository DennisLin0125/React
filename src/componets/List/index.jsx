import React, { Component } from 'react'
import PropTypes from 'prop-types'
import "./index.css"

import Item from "../Item"

export default class List extends Component {

  // 對接收的props進行: 類型,必要的限制
  static propTypes = {
    todos: PropTypes.array.isRequired,
    updateTodo: PropTypes.func.isRequired
  }

  render() {

    const {todos,updateTodo} = this.props
    return (
      <ul className="todo-main">
        {
          todos.map((todo) => {
            // return <Item key={todo.id} id={todo.id} name={todo.name} done={todo.done}/>;
            return <Item key={todo.id} {...todo} updateTodo={updateTodo}/>;
          })
        }
      </ul>
    )
  }
}
