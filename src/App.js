import React, { Component } from 'react'

import axios from 'axios'

// 配置defaul url  因為代理伺服器的port為React的3000故URL改為3000
axios.defaults.baseURL = "http://localhost:3000"

export default class App extends Component {
  
  getStudentData = () => {
    axios({
        method: "GET",
        //url
        url: "/students",

    }).then(res => {
        console.log("請求成功:",res.data);
    }).catch((reason)=>{
        console.error("失敗了:",reason);
    })
  }

  getCarData = () => {
    axios({
        method: "GET",
        //url
        url: "/cars",

    }).then(res => {
        console.log("請求成功:",res.data);
    }).catch((reason)=>{
        console.error("失敗了:",reason);
    });
  }
    

  render() {
    return (
      <div>
        <button onClick={this.getStudentData}>點擊獲取學生訊息</button>
        <button onClick={this.getCarData}>點擊獲取汽車訊息</button>
      </div>
    )
  }
}
