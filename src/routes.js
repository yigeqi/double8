import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom'
// import { Link, Router, Switch, Route } from 'react-router-dom'
import Footer from 'components/Footer';
import App from 'components/App';
import About from 'components/About';
import AboutTwo from 'components/AboutTwo';
import NotFound from 'components/NotFound';
import ChatRoom from 'components/ChatRoom'
import User from 'components/User'
import { Row, Col, Menu, Icon } from 'antd'
import createBrowserHistory from 'history/createBrowserHistory'
const history = createBrowserHistory()

class Routes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showChatRoom: !false,
      current: 'nav1'
    }
  }
  handleClick (e) {
    this.setState({
      current: e.key
    })
    if (e.key === 'nav1') {
      history.push('/')
    } else if (e.key === 'setting:1') {
      history.push('/about')
    } else {
      history.push('/aboutTwo')
    }
  }
  render() {
    return (
      <Router history={history}>
        <div>
          <div>
            <div className='alignC'>some logo or title</div>
            <Row>
              <Col span={16}>
                <Menu id='nav'
                  onClick={this.handleClick.bind(this)}
                  selectedKeys={[this.state.current]}
                  mode='horizontal'
                >
                  <Menu.Item key='nav1'>
                    <Icon type='mail'/>navigation1
                  </Menu.Item>
                  <Menu.SubMenu title={<span><Icon type='setting'/>navigation2</span>}>
                    <Menu.ItemGroup title='Item 1'>
                      <Menu.Item key='setting:1'>option1</Menu.Item>
                      <Menu.Item key='setting:2'>option2</Menu.Item>
                    </Menu.ItemGroup>
                  </Menu.SubMenu>
                  <Menu.Item key='nav3'>
                    <Icon type='calendar'/>navigation3
                  </Menu.Item>
                </Menu>
              </Col>
              <Col span={8}>
                <User/>
              </Col>
            </Row>
          </div>
          <Switch>
            <Route exact path='/' component={App}/>
            <Route path='/about' component={About}/>
            <Route path='/aboutTwo' component={AboutTwo}/>
            <Route component={NotFound}/>
          </Switch>
          <div style={{position:'fixed',bottom:0,left:0}}>
            <Footer/>
          </div>
          <div style={{position:'fixed',top:'70px',right:'10px'}}>
            {this.state.showChatRoom&&<ChatRoom/>}
          </div>
          <div style={{position:'fixed',bottom:0,right:'10px'}}>
            <Icon type="team" onClick={e=>this.setState({showChatRoom:!this.state.showChatRoom})}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default Routes;