import React, { Component } from 'react'
import {Dropdown, Menu, Icon} from 'antd'
import ChangePwdModal from './modals/ChangePwdModal'

class User extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
  }
  clickUser (e) {
    if (e.key==='changePwd') {
      this.setState({showModal:true})
    } else {

    }
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
        <Dropdown overlay={menu}>
          <a className='ant-dropdown-link'>
            <Icon type='smile-o' style={{ fontSize: 16, color: '#08c' }} />当前账号：xxx<Icon type="down" />
          </a>
        </Dropdown>
        <ChangePwdModal closeFun={()=>this.setState({showModal:false})} visible={this.state.showModal}/>
      </div>
    );
  }
}

export default User;
