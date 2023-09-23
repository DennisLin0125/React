// 創建外殼組件App

// 引入React 核心庫
import React, { Component } from 'react';
// 引入Hello組件
import Hello from './componets/Hello/Hello.js';
// 引入Welcome組件
import Welcome from './componets/Welcome/Welcome.js';


class App extends Component {
    state = {  }
    render() {
        return (
            <div>
               <Hello/>
               <Welcome/>
            </div>
        );
    }
}

export default App;