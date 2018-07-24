var express = require('express');
var router = express.Router();
let bodyParser = require('body-parser');
var fileStore = require('../db/file_store.js');

function getFileData(file_ID) {
  var file_data = "";
  var i = 0;
  console.log("Num Shards: " + fileStore.numShards(file_ID));
  while (fileStore.numShards(file_ID) > i) {
    file_data += fileStore.retrieveShard(file_ID,i);
    i++;
  }

  console.log("Sending file of length " + file_data.length);

  return file_data;
}

var path = require('path');
router.get('/:UploadId',function(req, res) {
  console.log("DOWNLOAD REQUEST");
  res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

router.post('/:UploadId', download);
function download(req, res) {

  if (!fileStore.exists(`${req.params.UploadId}`)) {
    console.log("FILE DOES NOT EXIST!");
    res.write(JSON.stringify({"msg": "FILE_DOES_NOT_EXIST", "ok": "ok"}));
    res.end();
    return
  }

  var file_ids = fileStore.getFilesInInstance(`${req.params.UploadId}`);
  var download_obj = [];

  //console.log("NUM FILES: " + file_ids.length);
  
  for (var i = 0; i < file_ids.length; i++) {
  
    var f_dat = getFileData(file_ids[i]);
    if (f_dat.length < 1) {
      res.write(JSON.stringify({"msg": "FILES_EXPIRED", "ok": "ok"}));
      res.end();
      return
    }
  
    download_obj.push( { "data": f_dat, "filename": fileStore.getFilename(file_ids[i]) } );
  }
-
  console.log("er");
  res.write(JSON.stringify( { download_obj, "msg":"download" , "ok": "ok"} ));

  //res.setHeader('Content-Length', file_data.length);
  //res.write(file_data, 'binary');

  //res.sendStatus(200);

  res.end();
}

module.exports = router;
