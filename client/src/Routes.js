import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import App from './components/App.js';
import Download from './components/Download.js';

class Routes extends Component {

	render() {
		return (
      <Router>
        <div>
          <Route exact path="/" component={App}/>
          <Route exact path="/download/:instanceID" component={Download}/>
        </div>
      </Router>
    );
  }
}

export default Routes;
