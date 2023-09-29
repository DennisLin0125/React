import React from 'react'
import { useLocation } from 'react-router-dom'



export default function Detail() {
    const {state:{id,title,content}} = useLocation();
    return (
        <ul>
            <li>編號:{id}</li>
            <li>標題:{title}</li>
            <li>內容:{content}</li>
        </ul>
    )
}
