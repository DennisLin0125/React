import React, { Component } from 'react'
import PubSub from 'pubsub-js'  // npm install pubsub-js
import './index.css'

export default class List extends Component {

  // 初始化狀態
  state = {
    users: [],       // users初始為數組
    isFirst: true,   //是否為第一次打開頁面
    isLoading: false, //是否為加載中
    errMsg: ""
  }

  // 組件mount後就啟用
  componentDidMount(){
    // 訂閱消息
    this.token = PubSub.subscribe('hello',(msg,stateObj) => {
      console.log("List組件收到數據:",stateObj);
      this.setState(stateObj);
    })
  }

  // 組件將被卸載後
  componentWillUnmount(){
    // 取消訂閱
    PubSub.unsubscribe(this.token);
  }

  render() {
    const {users, isFirst, isLoading, errMsg} = this.state
    return (
    <div className="row">
        {
            isFirst ? <h2>Welcome, enter keywords and click search</h2> :
            isLoading ? <h2>Loading........</h2> :
            errMsg ? <h2 style={{color:"red"}}>{errMsg}</h2> :

            users.map((userObj) => {
                const {login, avatar_url, html_url, id} = userObj
                return (
                    <div key={id} className="card">
                        <a href={html_url} target="_blank" rel="noreferrer">
                            <img src={avatar_url} style={{width: '100px'}} alt=''/>
                        </a>
                        <p className="card-text">{login}</p>
                    </div>
                )
            })
        }
    </div>
    )
  }
}
