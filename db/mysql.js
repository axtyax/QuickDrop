var mysql = require('mysql');

var con = mysql.createConnection({
  host: "host",
  user: "root",
  password: "35.196.41.20"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL!");
  con.query("USE quickdrop", function (err, result) {
    if (err) throw err;
  });
});

function saveFile(instanceID, fileID, file) {
  con.query("INSERT INTO files(instanceID, fileID, fileName, size) VALUES()", function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
}

function saveShard(instanceID, fileID, shard) {
  con.query("INSERT INTO shards(instanceID, fileID, shard, shardIndex) VALUES()", function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
}
