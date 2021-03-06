var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('quickdrop:server');
var http = require('http');
var fs = require('fs');
var forceSsl = require('force-ssl-heroku');


var indexRouter = require('./routes/index');
var uploadRouter = require('./routes/upload');
var fileStore = uploadRouter.fileStore;
var downloadRouter = require('./routes/download');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
//app.use(forceSsl);
/*app.use(express.json());
app.use(express.urlencoded({ extended: false }));*/
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/client/build')));

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser({limit: '10mb'}));
app.use(bodyParser.json())

//app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/download', downloadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);  
  res.render('error');
});

app.get('/*', (req, res) => {
//  console.log("GETTING HERE");
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

var SERVER_PORT = parseInt(process.env.PORT || 3000);

const file = './client/package.json';
let pkg = JSON.parse(fs.readFileSync(file).toString());
let npkg = `http://${process.env.HOST}:${SERVER_PORT}`;
let nstart = `PORT=${SERVER_PORT+1} react-scripts start`;
if (pkg.proxy == `http://undefined:${SERVER_PORT}`) {
  pkg.proxy = `http://localhost:${SERVER_PORT}`;
  fs.writeFileSync(file, JSON.stringify(pkg)); 
}
else if (pkg.proxy != npkg && pkg.proxy != `http://localhost:${SERVER_PORT}`) {
  pkg.proxy = npkg;
  fs.writeFileSync(file, JSON.stringify(pkg));
}
if (pkg.scripts.start != nstart) {
  pkg.scripts.start = nstart;
  fs.writeFileSync(file, JSON.stringify(pkg)); 
}

app.listen(SERVER_PORT, () => console.log(`Example app listening on port ${SERVER_PORT}!`))
