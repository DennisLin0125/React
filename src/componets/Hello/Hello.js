import React, { Component } from 'react';

import hello from"./Hello.module.css"

class Hello extends Component {
    state = {  }
    render() {
        return (
            <h2 className={hello.title}>Hello,React</h2>
        );
    }
}

export default Hello;