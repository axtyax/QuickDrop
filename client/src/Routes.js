import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import App from './components/App.js';
import Download from './components/Download.js';
import Dummy from './components/Dummy.js'

class Routes extends Component {

	render() {
		return (
      <Router>
        <div>
          <Route exact path="/" component={App}/>
          <Route exact path="/download/:instanceID" component={Download}/>
          <Route exact path="/wakemydyno.txt" component={Dummy}/>
        </div>
      </Router>
    );
  }
}

export default Routes;
