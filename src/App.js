import React, { Component } from 'react'

import axios from 'axios'

// 配置defaul url
axios.defaults.baseURL = "http://localhost:5000"

export default class App extends Component {
  
  getStudentData = () => {
    axios({
        method: "GET",
        //url
        url: "/students",

    }).then(res => {
        console.log("請求成功:",res);
    }).catch((reason)=>{
        console.error("失敗了:",reason);
    })
  }
  render() {
    return (
      <div>
        <button onClick={this.getStudentData}>點擊獲取學生訊息</button>
      </div>
    )
  }
}
