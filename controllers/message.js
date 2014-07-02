var express = require('express')
  , app = express();

var verifier = require('../lib/verifier')
  , base = require('../lib/base')
  , encode = base.encode
  , getToken = base.getToken;

app.post('/ask', function(req, res) {
  res.json({
    code: 200,
    message: 'Answer is here.'
  });
});

app.post('/askall', function(req, res) {
  res.json({
    code: 200,
    message: 'Broadcasted!!!'
  });
});

app.post('/answer', function(req, res) {
  res.json({
    code: 200,
    message: 'got your answer. Thank you.'
  });
})

module.exports = app;
