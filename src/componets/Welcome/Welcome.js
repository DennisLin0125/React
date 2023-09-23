import React, { Component } from 'react';
import welcome from'./Welcome.module.css'

class Welcome extends Component {
    state = {  }
    render() {
        return (
            <h2 className={welcome.title}>Welcome Dennis to learn React!!!</h2>
        );
    }
}

export default Welcome;