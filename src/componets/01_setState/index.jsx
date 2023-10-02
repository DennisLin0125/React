import React, { Component } from 'react'

export default class Demo extends Component {

    state = { count: 0 }

    increment = () => {
        // 物件式setState
        // const { count } = this.state
        // this.setState({ count: count + 1 }, () => {
        //     const { count } = this.state
        //     console.log('count', count)
        // })

        // 函數式setState
        this.setState((state, props) => { 
            console.log(state,props)
            return { count:state.count + 1 }
        })
    }

    render() {
        const { count } = this.state
        return (
            <div>
                <h1>當前求和為:{count}</h1>
                <button onClick={this.increment}>點我加1</button>
            </div>
        )
    }
}
