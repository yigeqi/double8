import React, { Component } from 'react';
import { Link, Router, Switch, Route } from 'react-router-dom'
import Footer from './components/Footer';
import App from './components/App';
import About from './components/About';
import AboutTwo from './components/AboutTwo';
import NotFound from './components/NotFound';

import createBrowserHistory from 'history/createBrowserHistory'
const history = createBrowserHistory()

class Routes extends Component {
  render() {
    return (
      <Router history={history}>
        <div>
          <div>header:
            <ul>
              <li><Link to='/'>to '/' Page</Link></li>
              <li><Link to='/about'>to About Page</Link></li>
              <li><Link to='/aboutTwo'>to AboutTwo Page</Link></li>
            </ul>
          </div>
          <Switch>
            <Route exact path='/' component={App}/>
            <Route path='/about' component={About}/>
            <Route path='/aboutTwo' component={AboutTwo}/>
            <Route component={NotFound}/>
          </Switch>
          <Footer/>
        </div>
      </Router>
    );
  }
}

export default Routes;