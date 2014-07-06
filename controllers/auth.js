var User = require('../models/user');

function fail(response) {
  response.json({
    code: 401,
    message: 'authentication failed'
  })
}

module.exports = function(req, res, next) {
  var params = req.body;
  if (!params.id || !params.token) {
    fail(res);
  }
  else {
    User.findById(params.id, function(err, user) {
      if (err) fail(res);
      if (user.token !== params.token) {
        fail(res)
      } else {
        req.user = user;
        next();
      }
    });
  }
}
