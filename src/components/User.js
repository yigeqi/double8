import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Dropdown, Menu, Icon, Avatar} from 'antd'
import LoginModal from './modals/LoginModal'
import ChangePwdModal from './modals/ChangePwdModal'
import {showModal} from '../actions/component'
import {logout} from '../actions/user'

class User extends Component {
  // constructor (props) {
  //   super(props)
  // }
  async clickUser (e) {
    if (e.key==='changePwd') {
      this.props.dispatch(showModal('ChangePwdModal'))
    } else {
      await this.props.dispatch(logout())
    }
  }
  showLoginModal () {
    this.props.dispatch(showModal('LoginModal'))
  }
  render() {
    const menu = (
      <Menu onClick={e=>this.clickUser(e)}>
        <Menu.Item key='changePwd'>修改密码</Menu.Item>
        <Menu.Item key='logout'>注销</Menu.Item>
      </Menu>
    )
    return (
      <div className='alignR'>
        {this.props.user.username?
        <Dropdown overlay={menu}>
          <a className='ant-dropdown-link'>
            <Avatar icon="user" src={this.props.user.avatar}/>当前账号：{this.props.user.username}<Icon type="down" />
          </a>
        </Dropdown>:<span onClick={()=>this.showLoginModal()}><Avatar icon="user"/>当前账号：请先登录</span>}
        <LoginModal/>
        <ChangePwdModal/>
      </div>
    );
  }
}

export default connect((state)=>{
  return {
    user: state.user
  }
})(User);
