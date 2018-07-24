var fs = require('fs');

var file_manifest = { "testfileid": ["shardid1","shardid2","shardid3"] }
var name_to_id = { "myid": "coolname.png" }
var file_instances = { "myinstanceid": ["file1_id","file2_id"] }

function updateManifestFile() {
  fs.writeFile("./file_manifest", JSON.stringify(file_manifest), function(err) { console.log("Error saving file manifest") });
}

function updateManifestObject() {
  file_manifest = JSON.parse(fs.readFileSync("./file_manifest"));
}

exports.exists = function(instance_ID) {
  return file_instances.hasOwnProperty(instance_ID)
}

exports.numShards = function(file_ID) {
  //console.log("Long: " + file_manifest[file_ID].length);
  //console.log("Looking for: " + file_ID);
  //console.log(file_manifest[file_ID]);
  return file_manifest[file_ID].data.length;
}

exports.retrieveShard = function(file_ID,shard_index) {
  //console.log("Shard Length: " + file_manifest[file_ID][shard_index].length);
  return file_manifest[file_ID].data[shard_index];
}

exports.createFile = function(file_ID,file_name) {
  eval("file_manifest." + file_ID + " = { 'data': [], 'death': 9999999999 };");
  name_to_id[file_ID] = file_name;
  //console.log(file_manifest);
  //console.log("file created");
}

exports.createInstance = function(instance_ID) {
  //console.log(instance_ID);
  if (!file_instances.hasOwnProperty(instance_ID)) file_instances[instance_ID] = [];
}

exports.addFileToInstance = function(file_ID,instance_ID) {
  file_instances[instance_ID].push(file_ID);
  console.log(file_instances[instance_ID]);
}

exports.deleteInstance = function(instance_ID) {
  for (var i = 0; i < file_instances[instance_ID].length; i++) {
    delete file_manifest[file_instances[instance_ID][i]];
  }
  delete file_instances[instance_ID];
}

exports.getFilesInInstance = function(instance_ID) {
  return file_instances[instance_ID];
}

exports.getFilename = function(file_ID) {
  return name_to_id[file_ID];
}

var lifetime_seconds = 60;
exports.startFileLife = function(fileID) {
  //destroy file in one minute
  //console.log(file_manifest);
  var e = "file_manifest." + fileID + ".death = " + new Date().getTime()/1000 + lifetime_seconds;
  //console.log(e);
  eval(e);
  //console.log("file lifed");
}

exports.saveShard = function (shard_ID,file_ID,shard_dat,shard_index) {
  //fs.writeFile(shard_ID, shard_dat, function(err) { console.log("Error saving shard") })
  eval("file_manifest." + file_ID).data.splice(shard_index,0, shard_dat);
  //console.log(file_manifest);
}

updateManifest = function() {
  for (var f in file_manifest) {
    //console.log("file death at " + file_manifest[f].death + " now " + (new Date().getTime()/1000));
    if (file_manifest[f].death <= (new Date().getTime()/1000) ) {
      //console.log("destroying file");
      delete file_manifest[f];

      for (var i in file_instances) {
        var index = file_instances[i].indexOf(f);
        console.log(file_instances[i]);
        console.log(f);
        console.log(`deleting ${index}`);
        if (index != -1)
        file_instances[i].splice(i.indexOf(f),1);
      }

      //sconsole.log(file_manifest)
    }
  }
}

//update manifest every x minutes
var minutes = 0.5, the_interval = minutes * 60 * 1000;
setInterval(function() {
  //console.log("UPDATING MANIFEST");
  updateManifest();
}, the_interval);
