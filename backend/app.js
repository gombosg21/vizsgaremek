const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const DB = require('./util/db')

// var indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mediaRouter = require('./routes/media');
const tagRouter = require('./routes/tag');

const app = express();

const corsOptions = {
  origin : ['http://localhost/'],
  optionsSuccessStatus: 200,
  preflightContinue: true
};

DB.connect();
DB.initDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

const version = 0.1;

// app.use('/', indexRouter);
app.use(`/api/v/${version}`,usersRouter);
app.use(`/api/v/${version}`,mediaRouter);
app.use(`/api/v/${version}`,tagRouter)

//catch 404 and forward to error handler
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
  res.json(err);
});

app.listen(3600)

module.exports = app;
