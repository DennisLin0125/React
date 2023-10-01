import React, { Component } from 'react'
import { nanoid } from 'nanoid'
import { connect } from 'react-redux'
import { createAddPersonAction } from '../../redux/actions/person'

class Person extends Component {

    addPerson = () => {
        const name = this.nameNode.value;
        const age = this.ageNode.value;
        const personObj = { id: nanoid(), name, age }
        this.props.addPerson(personObj);
        this.nameNode.value='';
        this.ageNode.value='';
    }
    render() {
        return (
            <div>
                <h2>我是Person組件,上方組件總和: {this.props.sum}</h2>
                <input ref={c => this.nameNode = c} type="text" placeholder='輸入名字' />
                <input ref={c => this.ageNode = c} type="text" placeholder='輸入年齡' />
                <button onClick={this.addPerson}>添加</button>
                <ul>
                    {
                        this.props.addP.map((person) => {
                            return (
                                <li key={person.id}>{person.name}--{person.age}</li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        addP: state.addP,
        sum: state.count
    }),
    {
        addPerson: createAddPersonAction
    }
)(Person)
