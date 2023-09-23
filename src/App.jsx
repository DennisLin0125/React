import React, { Component } from 'react'

import Header from "./componets/Header"
import List from "./componets/List"
import Footer from "./componets/Footer"
import "./App.css"

export default class App extends Component {
  render() {
    return (
      <div className="todo-container">
        <div className="todo-wrap">
          <Header/>
          <List/>
          <Footer/>
        </div>
      </div>
    )
  }
}
