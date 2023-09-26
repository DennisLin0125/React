import React, { Component } from 'react'
import PubSub from 'pubsub-js'  // npm install pubsub-js
// import axios from 'axios'

export default class Search extends Component {

  handleSearch = async () => {

    // 獲取用戶輸入,並改名為keyWord
    const {keyWordElement:{value:keyWord}} = this;
    
    if(keyWord.trim() === ""){
      alert("Please input something to search...");
      return;
    }

    // 發送請求前通知List更新狀態
    console.log("Search組件發布消息了!")
    PubSub.publish('hello',{
      isFirst: false,
      isLoading: true
    });
    // 發送網路請求  發送給代理伺服器
    // axios.get(`/api1/search/users?q=${keyWord}`)
    // .then((respones) => {
    //   // 請求成功後通知List更新狀態
    //   PubSub.publish('hello',{
    //     isLoading: false,
    //     users:respones.data.items
    //   });
    // })
    // .catch((err) => {
    //   // 請求失敗後通知List更新狀態
    //   PubSub.publish('hello',{
    //     isLoading: false,
    //     errMsg:err.message
    //   });
    // })

    // 使用fetch
    // fetch(`/api1/search/users2?q=${keyWord}`)
    // .then((respones) => {
    //   console.log('連接server正常')
    //   return respones.json()
    // })
    // .then((respones) => {
    //   PubSub.publish('hello',{
    //     isLoading: false,
    //     users:respones.items
    //   });
    // })
    // .catch((err) => {
    //   PubSub.publish('hello',{
    //     isLoading: false,
    //     errMsg:err.message
    //   });
    // })

    // 使用async await
    try {
      const respones = await fetch(`/api1/search/users2?q=${keyWord}`);
      const data = await respones.json();
      PubSub.publish('hello',{
            isLoading: false,
            users:data.items
          });

    } catch (err) {
      PubSub.publish('hello',{
            isLoading: false,
            errMsg:err.message
      });
    }
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
