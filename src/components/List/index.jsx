import React, { Component } from 'react'
import './index.css'

export default class List extends Component {
  render() {
    const {users, isFirst, isLoading, errMsg} = this.props
    return (
    <div className="row">
        {
            isFirst ? <h2>Welcome, enter keywords and click search</h2> :
            isLoading ? <h2>Loading........</h2> :
            errMsg ? <h2 style={{color:"red"}}>{errMsg}</h2> :

            users.map((userObj) => {
                const {login, avatar_url, html_url, id} = userObj
                return (
                    <div key={id} className="card">
                        <a href={html_url} target="_blank" rel="noreferrer">
                            <img src={avatar_url} style={{width: '100px'}} alt=''/>
                        </a>
                        <p className="card-text">{login}</p>
                    </div>
                )
            })
        }
    </div>
    )
  }
}
