var express = require('express');
var router = express.Router();
let bodyParser = require('body-parser');
var database = require('../db/mongodb.js');

router.get('/', function (req, res) {
  res.send('GET request to the upload page')
})

/*router.post('/:UploadId', upload);
function upload(req, res) {

  console.log(`Uploading file at instance ${req.params.UploadId}`);
  console.log(JSON.stringify(req.body));

  res.sendStatus(200);
}*/

router.post('/:UploadId/:UploadIndex', upload_index);
function upload_index(req, res) {

  console.log(`Uploading shard at index ${req.params.UploadIndex}`);
  console.log(req.body.data.length);

  res.sendStatus(200);
}

module.exports = router;
