import React from 'react'
import { useSearchParams,useLocation } from 'react-router-dom'


export default function Detail() {
    const [search,setSearch] = useSearchParams();
    const a = useLocation();
    console.log(a)
    return (
        <ul>
            <li>
                <button onClick={() => setSearch("id=008&title=哈哈&content=嘻嘻")}>點擊更新收到的search參數</button>
            </li>
            <li>編號:{search.get('id')}</li>
            <li>標題:{search.get('title')}</li>
            <li>內容:{search.get('content')}</li>
        </ul>
    )
}
