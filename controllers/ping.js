var verifier = require('../lib/verifier');

module.exports = function(req, res) {
  var params = req.body, id;
  var data = verifier.verifyPingParams(params);

  if (data.err) {
    res.json({
      code: 400,
      message: data.err
    })
    return;
  }

  id = params.id;

  User.findById(id, function(err, user) {
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
          questions: [
          ],
          answers: [
          ]
        })
      });
    }
  });
};
