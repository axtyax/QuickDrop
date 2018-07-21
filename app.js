var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('quickdrop:server');
var http = require('http');

var indexRouter = require('./routes/index');
var uploadRouter = require('./routes/upload');
var fileStore = uploadRouter.fileStore;
var downloadRouter = require('./routes/download');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//var port = normalizePort(process.env.PORT || '5000');
app.set('port', 5000);

app.use(logger('dev'));
/*app.use(express.json());
app.use(express.urlencoded({ extended: false }));*/
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser({limit: '2.5mb'}));
app.use(bodyParser.json())

app.use('/', indexRouter);
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

app.listen(process.env.PORT || 5000, () => console.log('Example app listening on port 5000!'))
