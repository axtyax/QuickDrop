import React, { Component } from 'react';
import './App.css';

import DropZone from './Drop';

class App extends Component {

	render() {
		return (

			<div className="Main">

				<link href="https://fonts.googleapis.com/css?family=Libre+Franklin" rel="stylesheet" />

				<h1 id="main-title"> QuickDrop </h1>
				<p id="title-caption"> Easy-to-use large temporary file storage </p>

				<DropZone />

			</div>
    );
  }
}

export default App;
