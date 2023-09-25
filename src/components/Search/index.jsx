import React, { Component } from 'react'
import axios from 'axios'

export default class Search extends Component {

  handleSearch = () => {
    // 獲取用戶輸入,並改名為keyWord
    const {keyWordElement:{value:keyWord}} = this;
    
    if(keyWord.trim() === ""){
      alert("Please input something to search...");
      return;
    }
    // 發送請求前通知App更新狀態
    this.props.updateAppState({
      isFirst: false,
      isLoading: true
    })
    // 發送網路請求  發送給代理伺服器
    axios.get(`/api1/search/users?q=${keyWord}`)
    .then((respones) => {
      // 請求成功後通知App更新狀態
      this.props.updateAppState({
        isLoading: false,
        users:respones.data.items
      })
    })
    .catch((err) => {
      // 請求失敗後通知App更新狀態
      this.props.updateAppState({
        isLoading: false,
        errMsg:err.message
      })
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
