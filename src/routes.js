import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import App from './components/App';
import About from './components/About';
import NotFound from './components/NotFound';

class Routes extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={App}/>
          <Route path="/about" component={About}/>
          <Route component={NotFound}/>
        </Switch>
      </Router>
    );
  }
}

export default Routes;