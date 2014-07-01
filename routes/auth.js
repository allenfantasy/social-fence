var express = require('express')
  , app = express();

var user = require('../models/user')

app.post('/signup', function(req, res) {
  // verify username & password
  // return err if username isnt valid
  // else
  // create an user
  // return & store TOKEN
  res.json({ code: 200, message: 'signup okay '})
})

app.post('/signin', function(req, res) {
  // verify username & password
  // return err if not valid
  // else
  // return & store TOKEN
})

module.exports = app;
