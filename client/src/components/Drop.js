import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';
import Dropzone from 'react-dropzone';
import Request from 'request';
import './Drop.css';

import Upload from './Upload.js'
import FileEntry from './FileEntry.js'

class DropZone extends Component {

	state = {
	}

	constructor(props) {
    	super(props);
    	this.state = {
		  UploadId: uuid(),
		  files: [ {"id": uuid(),"name": "file1", "size": 20}, {"id": uuid(),"name": "file2", "size": 15023000000} ]
     	}
     	this.onDrop=this.onDrop.bind(this);
  	}

	componentDidMount() {
		//this.setState ({ self: { "UploadId":  } })
		console.log(this.state.UploadId);
		window.addEventListener("dragover",this.fileDragover,false);
		window.addEventListener("drop",this.fileDrop,false);
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

	fileDragover = (e) => {
	  	e.preventDefault();
	}

	fileDrop = (e) => {
		e.preventDefault();
	}

	onDrop(acceptedFiles, rejectedFiles) {
		console.log("File dropped");

		/*const req = Request.post('/upload');
	    acceptedFiles.forEach(file => {
	        req.attach(file.name, file);
	    });
	    req.end();*/

		console.log(this.state.UploadId);
		return fetch(`/upload/${this.state.UploadId}`, {
	        method: 'POST',
	        body: 'Hello from React!!!'
	    });
	    //.then(response => response.json());
	}

	render() {
		return (
			<Dropzone className="drop-zone" onDrop={this.onDrop}>

					<p>Drag-and-drop files here then hit 'Upload'</p>

					<ul id="file-list">
						{this.getFiles()}
					</ul>

			</Dropzone>
    	);
  	}
}

export default DropZone;
