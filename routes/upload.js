var express = require('express');
var router = express.Router();
let bodyParser = require('body-parser');
var database = require('../db/mongodb.js');
var fileStore = require('../db/file_store.js');

var invalidated_instances = [];

router.get('/', function (req, res) {
  res.send('GET request to the upload page')
})

/*router.get('/:UploadId/msg/:messsage', upload_message);
function upload_message(req,res) {

  console.log(`got message ${req.params.message}`);



  res.sendStatus(200);

}*/

var instance_capacity = 25000000;
var shard_size = 2500000;

router.post('/:UploadId/:UploadIndex', upload_index);
function upload_index(req, res) {

  if (req.params.UploadIndex > instance_capacity / shard_size) {
   
    if (fileStore.exists(`${req.params.UploadId}`)) {
      fileStore.deleteInstance(`${req.params.UploadId}`);
    }

    res.sendStatus(405);
    return;

  }

  //console.log("123 " + req.params.UploadIndex);
  if (req.params.UploadIndex == 0) {
    fileStore.createInstance(`${req.params.UploadId}`);
  }

  if (req.body.is_first == 1) {

    console.log("creating file " + `${req.body.file_id}`);
    fileStore.createFile(`${req.body.file_id}`,`${req.body.filename}`);
    fileStore.createInstance(`${req.params.UploadId}`);
    fileStore.addFileToInstance(`${req.body.file_id}`,`${req.params.UploadId}`);

  }

  if (req.body.is_last == 1) {

    console.log("starting file life");
    fileStore.startFileLife(`${req.body.file_id}`);

  }

  console.log(`Uploading shard at index ${req.params.UploadIndex}`);
  console.log(`Populating file instance ${req.params.UploadId}`);
  console.log(req.body.data.length);

  fileStore.saveShard(req.params.UploadIndex,req.body.file_id,req.body.data,req.params.UploadIndex);

  //res.write(JSON.stringify( { "response": req.params.UploadIndex } ));
  res.sendStatus(200);
}

module.exports = router, fileStore;
