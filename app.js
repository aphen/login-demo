var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

//采用connect-mongodb中间件作为Session存储
var session = require('express-session');
var Settings = require('./database/settings');
var MongoStore = require('connect-mongodb');
var db = require('./database/msession');

var logger = require('morgan');
//var hash = require('./pass').hash;
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//session配置
app.use(session({
  cookie: { maxAge: 600000 },
  secret: Settings.COOKIE_SECRET,
  //store: new MongoStore({
  //  //username: Settings.USERNAME,
  //  //password: Settings.PASSWORD,
  //  //url:'mongodb://localhost:27017/login',
  //  db: db
  //}),
  resave: false, //添加 resave 选项
  saveUninitialized: true, //添加 saveUninitialized 选项
}));

app.use(function(req, res, next) {
  console.log(res.locals);
  res.locals.user = req.session.user;
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = '';

  if(err) {
    res.locals.message = '<div class="alert alert-warning">'  + err + '</div>';
  }

  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/logout', indexRouter);
app.use('/home', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
  	message: err.message,
  	error: {}
  });
});



module.exports = app;
