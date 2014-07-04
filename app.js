var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var ping = require('./controllers/ping')
  , index = require('./controllers/index')
  , message = require('./controllers/message')
  , users = require('./controllers/users')
  , people = require('./controllers/people');

var auth = require('./controllers/auth');

var app = express();

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// authenticate
app.use(auth);

app.get('/', index);

// auth subapp
app.use('/users', users);

// GET /people
app.get('/people', auth, people);

// POST /ping
app.post('/ping', auth, ping);

app.use('/', auth, message);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(process.env.PORT || 4000);
