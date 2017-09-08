import React, { Component } from 'react';
import './style.less';
import api from '../../api'

class About extends Component {
  async test1 () {
    const resp = await api.login()
    console.log(resp)
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
    return (
      <div className="About">
        <h2>About Component</h2>
        <h2 onClick={e=>this.test1()}> login</h2>
        <h2 onClick={e=>this.test2()}> logout</h2>
        <h2 onClick={e=>this.test3()}> register</h2>
        <h2 onClick={e=>this.test4()}> justtest</h2>
      </div>
    );
  }
}

export default About;
