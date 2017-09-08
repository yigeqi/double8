import React, { Component } from 'react';
import './style.less';
import api from '../../api'
import { connect } from 'react-redux'
import {login, addTodo,toggleTodo } from '../../actions'

class About extends Component {
  async test1 () {
    // const resp = await api.login()
    // console.log(resp)
    await this.props.dispatch(login())
  }
  async test2 () {
    const resp = await api.logout()
    console.log(resp)
  }
  async test3 () {
    const resp = await api.register()
    console.log(resp)
  }
  async test4 () {
    const resp = await api.justtest()
    console.log(resp)
  }
  render() {
    let input
    return (
      <div>
        <h2>About Component</h2>
        <h2 onClick={e=>this.test1()}> login</h2>
        <h2 onClick={e=>this.test2()}> logout</h2>
        <h2 onClick={e=>this.test3()}> register</h2>
        <h2 onClick={e=>this.test4()}> justtest</h2>
        <div>
          <div>
            <p>this.props.todos.length:{this.props.todos.length}</p>
            <form onSubmit={e => {
              e.preventDefault()
              if (!input.value.trim()) {
                return
              }
              this.props.dispatch(addTodo(input.value))
              input.value = ''
            }}>
              <input ref={node => {
                input = node
              }} />
              <button type="submit">
                Add Todo
              </button>
            </form>
            <ul>
              {this.props.todos.map(todo =>
                <li key={todo.id}
                  onClick={() => this.props.dispatch(toggleTodo(todo.id))}
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none'
                  }}
                >
                  {todo.text}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // todos: getVisibleTodos(state.todos, state.visibilityFilter)
  todos:state.todos
})

export default connect(mapStateToProps)(About);
