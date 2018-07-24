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
		  	UploadId: cuuid(),
		  	//files: [ {"id": uuid(),"name": "file1", "size": 20}, {"id": uuid(),"name": "file2", "size": 15023000000} ]
				uploading: false,
				sending: false,
				current_shard: 0,
				files: []
			}
     	this.onDrop = this.onDrop.bind(this);
			this.uploadFiles = this.uploadFiles.bind(this);

			//this.link-box-text = React.createRef();
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
		for (var f in this.state.files) {
			if (this.state.files[f].name == fileObj.name) return 0;
		}

		this.state.files.push({ 
			"id": cuuid(), 
			"name": fileObj.name, 
			"size": fileObj.size, 
			"object": fileObj,
			"uploadTracker": 'Not Uploaded'
		})
		this.setState ({ files: this.state.files });
	}

	getFiles() {
		const file_list = this.state.files.map(
			(f) =>
					<li key={f.name}>
					<span class="file-name"> {f.name} </span>
					<span class="file-size"> {f.size}B </span>
					<span class="file-upload-tracker" id={`fut-${f.id}`}> {f.uploadTracker} </span>
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

	updateTracker = (is_last,p_left,id) => {
		if (is_last == 0) {
			this.state.files[id].uploadTracker = p_left;
			this.setState({ files: this.state.files });
		}
		else {
			this.state.files[id].uploadTracker = 'Uploaded';
			this.setState({ files: this.state.files });
		}
	}

	sendFileShard(file,file_index,file_arr,index) {

		/*while(this.state.sending == true) {
			//set timeout here
			console.log('sending');
		}*/

		this.setState({ sending: true });
		this.setState({ at_final_shard: false });

		var SHARD_SIZE = 2500000;
		var arr_end = (index+1)*SHARD_SIZE;

		if(index*SHARD_SIZE >= file_arr.length) {
			return 0;
		}

		if((index+1)*SHARD_SIZE >= file_arr.length)
			arr_end = file_arr.length

		var file_str = ""
		for (var i = index*SHARD_SIZE; i < arr_end; i++)
			file_str += String.fromCharCode(file_arr[i]+128);

		console.log(file_str.length);

		var is_first = 0;
		var is_last = 0;

		if (index == 0) is_first = 1;
		if (arr_end == file_arr.length) is_last = 1;

		var p_left = `${(SHARD_SIZE*index*100.0/(file_arr.length))}%`;
		console.log(p_left);
		//console.log(`last ${is_last}`);
		//console.log(`fut-${file_index}`);

		
		this.updateTracker(is_last,p_left,file_index);

		return fetch(`/upload/${this.state.UploadId}/${index}`, {
			method: 'post',
			body: JSON.stringify({
				"data":file_str,
				"file_id": file.id,
				"filename": file.name,
				"is_first": is_first,
				"is_last": is_last
			}),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function(response) {
			this.setState({ sending: false })
			this.checkStatus(response);
		}.bind(this));

	}

	async sendFileObj(file,f_index) {


		var reader = new FileReader();
		var instance = this;
		reader.onload = function () {

			var file_arr = new Int8Array(reader.result);
	  		console.log(file_arr); //this is an ArrayBuffer
			var i = 0;
			while (instance.sendFileShard(file,f_index,file_arr,i)) {
				console.log("sent shard");
				i++;
			}

	  	}.bind(this,file);
		//console.log("type " + typeof reader.readAsArrayBuffer(file));

		return reader.readAsArrayBuffer(file.object);

	}

	onDrop = (files) => {

		for(var i = 0; i < files.length; i++)
			this.addFile(files[i]);

	}

	uploadFiles() {

		var s = 0;
		for(var i = 0; i < this.state.files.length; i++) {
			s += this.state.files[i].size;
		}


		var updateTracker = setInterval(function() {

			var good = true;
			for (var i = 0; i < this.state.files.length; i++) {
				if (this.state.files[i].uploadTracker != 'Uploaded') {
					good = false;
				}
				else {
					var elem = `fut-${this.state.files[i].id}`;
					document.getElementById(elem).innerHTML = this.state.files[i].uploadTracker;
					document.getElementById(elem).color = "green";
				}	
			}

			if (good) {
				document.getElementById('link-box-text').innerHTML = `${window.location.href}download/${this.state.UploadId}`;
				document.getElementById('link-box-text').href = `${window.location.href}download/${this.state.UploadId}`;
				clearInterval(updateTracker);
			}


		}.bind(this), 200);

		if (s <= 25000000) {
			for(var i = 0; i < this.state.files.length; i++) {
				if (this.state.files[i].uploadTracker != 'Uploaded')
					this.sendFileObj(this.state.files[i],i);
			}
		
		}

		else {
			document.getElementById('upload-warning').innerHTML = "Please limit uploads to 25mb";
		}

	}


	checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			this.setState({ last_response: response.status })
			return response
		} else {
			var error = new Error(response.statusText)
			error.response = response
			throw 'error while uploading'
		}
	}

	render() {
		return (
			<Dropzone className="drop-zone" onDrop={this.onDrop} disableClick={true}>

					<p>Drag-and-drop files here then hit 'Upload'</p>

					<ul id="file-list">
						{this.getFiles()}
					</ul>

					<button type="button" id="upload-button" onClick={this.uploadFiles}> Upload! </button>

					<p id="upload-warning"> </p>

					<div id="link-box"> Download Link: <a id='link-box-text' ref='link-box-text' target="_blank" href=""></a> </div>

			</Dropzone>
    	);
  	}
}

var cuuid = function() {
	return uuid().replace(/[0-9]/g, 'x').replace(/-/g,'y');
}

export default DropZone;
