import React from 'react'
import { useParams } from 'react-router-dom'


export default function Detail() {
    const { id, title, content } = useParams();
    // const a = useMatch('/home/message/detial/:id/:title/:content');
    // console.log('a', a)
    return (
        <ul>
            <li>編號:{id}</li>
            <li>標題:{title}</li>
            <li>內容:{content}</li>
        </ul>
    )
}
