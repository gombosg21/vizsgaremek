const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require("express-session");
const passport = require('passport');

const DB = require('./util/db');
const auth = require('./middlewares/authentiaction/auth');

const usersRouter = require('./routes/users');
const mediaRouter = require('./routes/media');
const tagRouter = require('./routes/tag');
const indexRouter = require('./routes/index');
const threadRouter = require('./routes/thread');
const commentRouter = require('./routes/comment');

const app = express();

const corsOptions = {
  origin: ['http://localhost/'],
  optionsSuccessStatus: 200,
  preflightContinue: true
};

DB.connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
app.use(session(auth.sessionConfig));
passport.use(auth.strategy);
app.use(passport.initialize());
app.use(passport.session());

const version = process.env.VERSION ?? 0.1;

const routePrefix = '/api/v/' + version;

app.use(routePrefix, indexRouter)
app.use(routePrefix, usersRouter);
app.use(routePrefix, mediaRouter);
app.use(routePrefix, tagRouter);
app.use(routePrefix,threadRouter);
app.use(routePrefix,commentRouter);


//catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//error handler
app.use(function (err, req, res, next) {
  const mode = process.env.MODE.toLowerCase();
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === mode ? err : {};

  // send error state and message
  res.status(err.status || 500)
    .json(err);
  console.error(err);
});

const port = process.env.APP_PORT;

app.listen(port,()=> { console.log(`listening on port: ${port}`)});

module.exports = app;
