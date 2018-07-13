import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';
import Dropzone from 'react-dropzone';
import Request from 'request';
import request from 'superagent';
import './Drop.css';

import upload from 'superagent';

import Upload from './Upload.js'
import FileEntry from './FileEntry.js'

class DropZone extends Component {

	state = {
	}

	constructor(props) {
    	super(props);
    	this.state = {
		  	UploadId: uuid(),
		  	//files: [ {"id": uuid(),"name": "file1", "size": 20}, {"id": uuid(),"name": "file2", "size": 15023000000} ]
				files: []
			}
     	this.onDrop = this.onDrop.bind(this);
			this.uploadFiles = this.uploadFiles.bind(this);
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

	addFile(fileObj) {
		this.state.files.push({ "id": uuid(), "name": fileObj.name, "size": fileObj.size, "object": fileObj })
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

	sendFileShard(file_arr,index) {

		var SHARD_SIZE = 2500000;

		var arr_end = (index+1)*SHARD_SIZE;
		if(index*SHARD_SIZE >= file_arr.length)
			return 0;

		if((index+1)*SHARD_SIZE >= file_arr.length)
			arr_end = file_arr.length

		var file_str = ""
		for (var i = index*SHARD_SIZE; i < arr_end; i++)
			file_str += String.fromCharCode(file_arr[i]);

		console.log(file_str.length);

		return fetch(`/upload/${this.state.UploadId}/${index}`, {
			method: 'post',
			body: JSON.stringify({"data":file_str}),
			headers: {
				"Content-Type": "application/json"
			}
		});

		return 1;
	}

	sendFileObj(file) {


		var reader = new FileReader();
		var instance = this;
		reader.onload = function () {

			var file_arr = new Int8Array(reader.result);
	  	console.log(file_arr); //this is an ArrayBuffer
			var i = 0;
			while (instance.sendFileShard(file_arr,i)) {i++;}

	  }
		reader.onload.bind(this);
	  reader.readAsArrayBuffer(file);

	}

	onDrop = (files) => {

		for(var i = 0; i < files.length; i++)
			this.addFile(files[i]);

	}

	uploadFiles() {

		for(var i = 0; i < this.state.files.length; i++)
			this.sendFileObj(this.state.files[i].object);

	}

	checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response
		} else {
			var error = new Error(response.statusText)
			error.response = response
			throw 'error while uploading'
		}
	}

	render() {
		return (
			<Dropzone className="drop-zone" onDrop={this.onDrop}>

					<p>Drag-and-drop files here then hit 'Upload'</p>

					<ul id="file-list">
						{this.getFiles()}
					</ul>

					<button type="button" id="upload-button" onClick={this.uploadFiles}> Upload! </button>

			</Dropzone>
    	);
  	}
}

export default DropZone;
