import React, { Component } from 'react'
import './index.css'

export default class List extends Component {
  render() {
    return (
    <div className="row">
        {
            this.props.users.map((userObj) => {
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
