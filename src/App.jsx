import React from 'react'
import {NavLink, useRoutes} from 'react-router-dom'
import routers from './routers'

export default function App() {
  // 根據路由表生成對應的路由
  const elements = useRoutes(routers)

  return (
    <div>
      <div className="row">
        <div className="col-xs-offset-2 col-xs-8">
          <div className="page-header"><h2>React Router Demo</h2></div>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-2 col-xs-offset-2">
          <div className="list-group">
            {/* 路由鏈接 */}
            <NavLink className="list-group-item" to="/about">About</NavLink>
            <NavLink className="list-group-item" to="/home">Home</NavLink>
          </div>
        </div>
        <div className="col-xs-6">
          <div className="panel">
            <div className="panel-body">
              {/* 註冊路由 */}
              {elements}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
