import React, { Component } from 'react';
import './App.css';

import DropZone from './Drop';

class App extends Component {

	render() {
		return (

			<div className="Main">

				<link href="https://fonts.googleapis.com/css?family=Libre+Franklin" rel="stylesheet" />

				<a href="http://dariusbarbano.com" id="mysite">My Site</a>

				<h1 id="main-title"> QuickDrop </h1>
				<p class="caption"> Easy-to-use temporary file storage </p>

				<DropZone />

				<h1 class="bottom-caption">
					QuickDrop stores up to 50mb of files for 12 hours. To retrieve files after uploading, 
					just paste the given link into your browser. 
				</h1>

			</div>
    );
  }
}

export default App;
