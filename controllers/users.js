var express = require('express')
  , app = express();

var verifier = require('../lib/verifier')
  , verifyAuthParams = verifier.verifyAuthParams
  , util = require('../lib/util')
  , encode = util.encode
  , getToken = util.getToken;

var user = require('../models/user')

function signinHandler(req, res) {
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
}

function signupHandler(req, res) {
  var params = req.body, username, password, user, token;
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
  token = getToken(username, password);

  user = new User({ name: username, password: encode(password), token: token })

  user.save(function(err, user) {
    if (err) {
      res.json({
        code: 500,
        message: err.message
      });
    } else {
      res.json({
        code: 200,
        token: token
      })
    }
  });
}

module.exports = function() {

  app.post('/signin', signinHandler);
  app.post('/signup', signupHandler);
  return app;
};
