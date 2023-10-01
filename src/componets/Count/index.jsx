import React, { Component } from 'react'

export default class Count extends Component {

    state = { carName: "BMW" }

    // 加法
    increment = () => {
        // 獲取用戶輸入
        const { value } = this.selectNumber;
        this.props.add(value * 1);
    }
    // 減法
    decrement = () => {
        // 獲取用戶輸入
        const { value } = this.selectNumber;
        this.props.sub(value * 1);
    }
    // 當前求和為奇數再加
    incrementIfOdd = () => {
        // 獲取用戶輸入
        const { value } = this.selectNumber;
        if (this.props.count % 2 !== 0) {
            this.props.add(value * 1);
        }
    }
    // 異步加
    incrementAsync = () => {
        // 獲取用戶輸入
        const { value } = this.selectNumber;
        this.props.async(value * 1, 500);

    }
    render() {
        console.log('UI:', this.props)
        return (
            <div>
                <h1>當前求和為: {this.props.count}</h1>
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
