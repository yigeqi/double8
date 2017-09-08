import React, { Component } from 'react'
import {Modal} from 'antd'

class ChangePwdModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmLoading: false
    }
  }
  handleOk (e) {
    this.setState({
      confirmLoading: true,
    })
    setTimeout(() => {
      this.setState({
        confirmLoading: false,
      })
      this.props.closeFun()
    }, 2000)
  }
  render() {
    return (
      <Modal 
        title='修改密码' 
        visible={this.props.visible}
        onOk={e=>this.handleOk()}
        confirmLoading={this.state.confirmLoading}
        onCancel={e=>this.props.closeFun()}
      >
        <div>.......</div>
      </Modal>
    );
  }
}

export default ChangePwdModal;
