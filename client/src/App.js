import React, { Component } from 'react';
import './App.css';

import DropZone from './components/Drop';

class App extends Component {


	render() {
		return (
			<div className="App">

				<h1 id="main-title"> QuickDrop </h1>
				<p id="title-caption"> Easy-to-use large temporary file storage </p>

				<DropZone />

			</div>
    );
  }
}

export default App;
