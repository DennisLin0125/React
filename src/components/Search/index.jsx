import React, { Component } from 'react'
import axios from 'axios'

export default class Search extends Component {

  handleSearch = () => {
    // 獲取用戶輸入,並改名為keyWord
    const {keyWordElement:{value:keyWord}} = this;
    // 發送網路請求  發送給代理伺服器
    axios.get(`/api1/search/users?q=${keyWord}`)
    .then((respones) => {
      this.props.saveUsers(respones.data.items)
    })
    .catch((err) => {
      console.log('err:', err)
    })
  }

  render() {
    return (
      <section className="jumbotron">
        <h3 className="jumbotron-heading">Search Github Users</h3>
        <div>
          <input ref={c => {this.keyWordElement = c}} type="text" placeholder="enter the name you search"/>&nbsp;
          <button onClick={this.handleSearch}>Search</button>
        </div>
      </section>
    )
  }
}
