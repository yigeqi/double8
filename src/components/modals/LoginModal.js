import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Modal,Spin,Form, Icon, Input, Button, Checkbox} from 'antd'
import {login} from '../../actions/user'
import {showModal} from '../../actions/component'

class LoginModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmLoading: false
    }
  }
  handleSubmit (e) {
    e.preventDefault();
    this.form.validateFields(async(err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
        await this.props.dispatch(login({username:values.username,password:values.password}))
        this.setState({
          confirmLoading: false,
        })
        this.props.dispatch(showModal(''))
      }
    })
  }
  render() {
    const MyForm = Form.create()(
      (props) => {
        const { getFieldDecorator } = props.form
        const FormItem = Form.Item
        return (
          <Form onSubmit={props.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>Remember me</Checkbox>
              )}
              <a className="login-form-forgot" href="">Forgot password</a>
              <Button type="primary" htmlType="submit" className="login-form-button">
                {props.confirmLoading?<Spin />:'Log in'}
              </Button>
              Or <a href="">register now!</a>
            </FormItem>
          </Form>
        )
      }
    )
    return (
      <Modal 
        title='登录' 
        visible={this.props.currentModal==='LoginModal'}
        onCancel={e=>this.props.dispatch(showModal(''))}
        footer={null}
      >
        <MyForm ref={form=>this.form=form} handleSubmit={this.handleSubmit.bind(this)} confirmLoading={this.state.confirmLoading}/>
      </Modal>
    );
  }
}

export default connect((state)=>{
  return {
    currentModal: state.component.currentModal
  }
})(LoginModal)
