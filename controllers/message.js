var express = require('express')
  , app = express();

var verifier = require('../lib/verifier')
  , verifyAskParams = verifier.verifyAskParams
  , verifyAskallParams = verifier.verifyAskallParams
  , util = require('../lib/util')
  , encode = util.encode
  , getToken = util.getToken;

var Message = require('../models/Message');

function askHandler(req, res) {
  var user = req.user;

  var data = verifyAskParams(req.body);

  if (data.err) {
    res.json({
      code: 400,
      message: data.err
    })
    return;
  }

  var question = new Message({
    body: data.body,
    type: 0,
    longitude: user.longitude,
    latitude: user.longitude,
    senderId: user.id,
    createdAt: new Date()
  });

  question.save(function(err, question) {
    if (err) {
      res.json({
        code: 400,
        message: err.message
        //message: '/ask: something wrong when saving questions'
      })
    }

    // auto answers return
    res.json({
      code: 200,
      answers: question.bestAnswers(),
      id: question.id
    });
  });
}

function askallHandler(req, res) {
  var user = req.user;

  var data = verifyAskallParams(req.body);

  if (data.err) {
    res.json({
      code: 400,
      message: data.err
    })
    return;
  }

  Message.findById(data.question_id, function(err, question) {
    if (err) {
      res.json({
        code: 400,
        message: '/askall: ' + err.message
      });
    }
    // push question
    global.QUESTION_QUEUE.push({
      question_id: question.id,
      user_id: user.id
    });

    res.json({
      code: 200,
      message: 'broadcast success'
    });
  });

}

function answerHandler(req, res) {
  var data = verifyAnswerParams(req.body);

  if (data.err) {
    res.json({
      code: 400,
      message: data.err
    })
    return;
  }

  // find queue?

  res.json({
    code: 200,
    message: 'got your answer. Thank you.'
  });
}

module.exports = function() {

  app.post('/ask', askHandler);

  app.post('/askall', askallHandler);

  app.post('/answer', answerHandler);

  return app;
}
