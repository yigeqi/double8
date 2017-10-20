import React, { Component } from 'react';
var socket
class ChatRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: '',
      receivedMsg: []
    }
  }
  componentDidMount () {
    socket = window.io()
    socket.on('chat message',(msg)=>{
      var arr = this.state.receivedMsg
      arr.push(msg)
      this.setState({receivedMsg:arr})
    })
  }
  handleValue(val) {
    this.setState({msg:val})
  }
  sendMsg (){
    socket.emit('chat message', this.state.msg)
    this.setState({msg:''})
  }
  render() {
    return (
      <div>
        <h2>ChatRoom Component</h2>
        <div>
          <ul>
            {this.state.receivedMsg.map((val,index)=>{
              return <li key={index}>{val}</li>
            })}
          </ul>
          <input type='text' value={this.state.msg} onChange={e=>this.handleValue(e.target.value)}/>
          <input type='button' value='send' onClick={()=>this.sendMsg()}/>
        </div>
      </div>
    );
  }
}

export default ChatRoom;
