import React, { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function Message() {
    const navigate = useNavigate();
    const [messages] = useState([
        { id: "001", title: "消息1", content: "Hello Dennis" },
        { id: "002", title: "消息2", content: "Hello React" },
        { id: "003", title: "消息3", content: "Hello Vue" },
        { id: "004", title: "消息4", content: "Hello Javascript" },
    ])

    function showDetail(message) {
        navigate('detial', {
            replace: false,
            state: {
                id: message.id,
                title: message.title,
                content: message.content
            }
        });
    }
    return (
        <div>
            <ul>
                {
                    messages.map((message) => {
                        return (
                            // 路由鏈接
                            <li key={message.id}>
                                <Link
                                    to='detial'
                                    state={{
                                        id: message.id,
                                        title: message.title,
                                        content: message.content
                                    }}>{message.title}
                                </Link>
                                <button onClick={() => showDetail(message)}>查看詳情</button>
                            </li>
                        )
                    })
                }
            </ul>
            <hr />
            {/* 指定路由的展示位置 */}
            <Outlet />
        </div>
    )
}
