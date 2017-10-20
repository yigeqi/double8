import React, { Component } from 'react';
import './style.less';
import api from 'api'
// import { connect } from 'react-redux'
// import {login } from 'actions/user'

class About extends Component {
  async test1 () {
    const resp = await api.login({username:'test1',password:'1'})
    console.log(resp)
    // await this.props.dispatch(login({username:'test1',password:'1'}))
  }
  async test2 () {
    const resp = await api.logout()
    console.log(resp)
  }
  async test3 () {
    const resp = await api.register({username:'test2',password:'1'})
    console.log(resp)
  }
  async test4 () {
    const resp = await api.justtest()
    console.log(resp)
  }
  render() {
    return (
      <div>
        <h2>About Component</h2>
        <h2 onClick={()=>this.test1()}> login</h2>
        <h2 onClick={()=>this.test2()}> logout</h2>
        <h2 onClick={()=>this.test3()}> register</h2>
        <h2 onClick={()=>this.test4()}> justtest</h2>
        <div>
          <div>


          </div>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({
  // todos: getVisibleTodos(state.todos, state.visibilityFilter)
  // todos:state.todos
// })

// export default connect(mapStateToProps)(About);
export default About;
