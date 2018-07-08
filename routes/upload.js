var express = require('express');
var router = express.Router();
let bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/', function (req, res) {
  res.send('GET request to the homepage')
})

console.log("ROUTER LOADED");
router.post('/:UploadId', update);
function update(req, res) {
  console.log('updating-', req.params.UploadId);
  res.sendStatus(200);
}

module.exports = router;
