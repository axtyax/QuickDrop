import React, { Component } from 'react';
import './Download.css';
import './App.css';

class Download extends Component {

	state = {
	}

	constructor(props) {
    	super(props);
    	this.state = {
				files: []
			}
			this.downloadFiles = this.downloadFiles.bind(this);
  	}

	downloadFiles() {
		console.log("Fetching");
		fetch(`${window.location.pathname}`, {
			method: 'post'
		}).then(function (response) {
			this.handleResponse(response);
		}.bind(this))
	}

	async downloadFile(data_blob,fname) {

		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";

		console.log(data_blob.length);

		var data_arr = [];
		for (var i = 0; i < data_blob.length; i++) {
			data_arr.push(data_blob.charCodeAt(i)+128);
		}

		var enc = new TextEncoder();
		var data_arr = new Int8Array(data_arr);

		console.log(data_arr);

		var blob = new Blob([data_arr], {}),
				url = window.URL.createObjectURL(blob);

		a.href = url;
 		a.download = fname;
 		a.click();

		window.URL.revokeObjectURL(url);

	}

	handleResponse(response) {
		if (response.status >= 200 && response.status < 300) {
			response.json().then( (body) => {
				if (body.ok == "ok") {
					if (body.msg == "FILE_DOES_NOT_EXIST") {
						var error = new Error(response.statusText)
						console.log("File does not exist");
						//throw 'error while downloading files'
					}
					else if (body.msg == "FILE_EXPIRED") {
						console.log("This file has expired");
					}
					else {
						console.log(body.download_obj)
						for (var i = 0; i < body.download_obj.length; i++) {
							this.setState({ last_response: body.download_obj[i].data })
							this.downloadFile(body.download_obj[i].data,body.download_obj[i].filename);
						}
					}
				}
				else {
					console.log("Something went wrong");
				}
			} );
		}
		else {
			console.log("SERVER ERROR!");
		}
	}


	render() {
		return (

			<div className="Main">

				<link href="https://fonts.googleapis.com/css?family=Libre+Franklin" rel="stylesheet" />

				<h1 id="main-title"> QuickDrop </h1>
				<p id="title-caption"> Easy-to-use large temporary file storage </p>

				<button type="button" id="download-button" onClick={this.downloadFiles}> Download Files </button>

			</div>

    );
  }
}

export default Download;
