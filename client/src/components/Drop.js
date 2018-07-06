import React, { Component } from 'react';
import uuid from 'uuid';
import './Drop.css';

import Upload from './Upload.js'
import FileEntry from './FileEntry.js'

class DropZone extends Component {

	state = {
		files: [ {"id": uuid(),"name": "file1", "size": 20}, {"id": uuid(),"name": "file2", "size": 15023000000} ]
	}


	removeFile(id) {
		const i = this.state.files.findIndex(x => x.id === id);
		console.log(i);
		this.state.files.splice(i,1);
		this.setState ({ files: this.state.files });
	}

	getFiles() {
		const file_list = this.state.files.map(
			(f) =>
					<li key={f.name}>
					<span class="file-name"> {f.name} </span>
					<span class="file-size"> {f.size} </span>
					<button type="button" onClick={() => this.removeFile(f.id)}> X </button>
					</li> );
		return file_list;
	}

	render() {
		return (
			<div id="drop-zone">

				<p>Drag-and-drop files here then hit 'Upload'</p>

				<ul id="file-list">
					{this.getFiles()}
				</ul>

			</div>
    	);
  	}
}

export default DropZone;
