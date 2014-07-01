var User = require('../models/user');

module.exports = {
  verifySigninParams: function(params) {
    var validParams = ["username", "password"], attr, val, username, password, user;
    for(var i=0; i < validParams.length; i++) {
      attr = validParams[i]
      val = params[attr];
      if (!val) {
        return { err: 'missing ' + name };
      }
    }
    return params;
  }
}
