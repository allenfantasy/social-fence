var verifier = require('../lib/verifier');
//var User = require('../models/user');

module.exports = function(req, res) {
  var user = req.user;
  var data = verifier.verifyPingParams(req.body);

  if (data.err) {
    res.json({
      code: 400,
      message: data.err
    })
    return;
  }

  if (err) {
    res.json({
      code: 500,
      message: "cannot find user"
    })
  } else if (token !== user.token) {
    res.json({
      code: 401,
      message: 'invalid token. auth failed'
    })
  } else {
    user.update({ $set: { longitude: params.longitude, latitude: params.latitude }}, function() {
      // return infos
      res.json({
        code: 200,
        questions: user.questionsAround(),
        answers: user.getAnswers()
      })
    });
  }
};
