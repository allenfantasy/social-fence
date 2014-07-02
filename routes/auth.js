var express = require('express')
  , app = express();

var verifier = require('../lib/verifier')
  , verifyAuthParams = verifier.verifyAuthParams
  , base = require('../lib/base')
  , encode = base.encode
  , getToken = base.getToken;

var user = require('../models/user')

app.post('/signin', function(req, res) {
  var params = req.body, username, password, token;
  // verify username & password
  var data = verifier.verifyAuthParams(params)

  if (data.err) {
    res.json({
      code: 400,
      message: data.err
    })
    return;
  }

  username = params.username;
  password = params.password;

  // return err if username isnt valid
  User.findByName(username, function(err, user) {
    if (!user) {
      res.json({
        code: 500,
        message: 'cannot find user'
      });
    } else if (encode(password) !== user.password) {
      res.json({
        code: 401,
        message: 'authentication failed'
      });
    } else {
      token = getToken(username, password);
      user.update({ $set: { token: token }}, function() {
        // return & store TOKEN
        res.json({ code: 200, token: token });
      })
    }
  });
})

app.post('/signup', function(req, res) {
  var params = req.body, username, password;
  var data = verifier.verifyAuthParams(params)

  if (data.err) {
    res.json({
      code: 400,
      message: data.err
    })
    return;
  }

  username = params.username;
  password = params.password;

  var user = new User({ name: username, password: encode(password) })
  user.save(function(err, user) {
    if (err) {
      res.json({
        code: 500,
        message: err.message
      });
    } else {
      var token = getToken(username, password);
      res.json({
        code: 200,
        token: token
      })
    }
  });
})

module.exports = app;
