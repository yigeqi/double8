import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Modal} from 'antd'
import {showModal} from '../../actions/component'
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
      this.closeModal()
    }, 2000)
  }
  closeModal () {
    this.props.dispatch(showModal(''))
  }
  render() {
    return (
      <Modal 
        title='修改密码' 
        visible={this.props.currentModal==='ChangePwdModal'}
        onOk={e=>this.handleOk()}
        confirmLoading={this.state.confirmLoading}
        onCancel={e=>this.closeModal()}
      >
        <div>.......</div>
      </Modal>
    );
  }
}

export default connect((state)=>{
  return {
    currentModal: state.component.currentModal
  }
})(ChangePwdModal);
