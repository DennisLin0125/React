import React from 'react'

export default function Demo() {

    const [count, setState] = React.useState(0)
    const [name, setName] = React.useState('tom')

    function add() {
        // 第一種寫法
        // setState(count + 1) 

        // 第二種寫法
        setState((count) => count + 1)

    }

    function changeName () {
        setName('Dennis')
    }
    return (
        <div>
            <h1>當前求和為:{count}</h1>
            <h2>我的名字是:{name}</h2>
            <button onClick={add}>點我加1</button>
            <button onClick={changeName}>點我改名字</button>
        </div>
    )
}
