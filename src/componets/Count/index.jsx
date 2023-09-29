import React, { Component } from 'react'

export default class Count extends Component {

    state = { count: 0 }

    // 加法
    increment = () => {
        // 獲取用戶輸入
        const { value } = this.selectNumber;
        // 獲取原來狀態值
        const { count } = this.state;
        // *1 為了強制將字串轉數字
        this.setState({ count: count + value * 1 })
    }
    // 減法
    decrement = () => {
        // 獲取用戶輸入
        const { value } = this.selectNumber;
        // 獲取原來狀態值
        const { count } = this.state;
        // *1 為了強制將字串轉數字
        this.setState({ count: count - value * 1 })
    }
    // 當前求和為奇數再加
    incrementIfOdd = () => {
        // 獲取用戶輸入
        const { value } = this.selectNumber;
        // 獲取原來狀態值
        const { count } = this.state;
        if (count % 2 === 1) {
            // *1 為了強制將字串轉數字
            this.setState({ count: count + value * 1 })
        }
    }
    // 異步加
    incrementAsync = () => {
        // 獲取用戶輸入
        const { value } = this.selectNumber;
        // 獲取原來狀態值
        const { count } = this.state;
        setTimeout(() => {
            // *1 為了強制將字串轉數字
            this.setState({ count: count + value * 1 })
        }, 500);
    }
    render() {
        return (
            <div>
                <h1>當前求和為: {this.state.count}</h1>
                <select ref={c => this.selectNumber = c}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>&nbsp;
                <button onClick={this.increment}>+</button>&nbsp;
                <button onClick={this.decrement}>-</button>&nbsp;
                <button onClick={this.incrementIfOdd}>當前求和為奇數再加</button>&nbsp;
                <button onClick={this.incrementAsync}>異步加</button>
            </div>
        )
    }
}
