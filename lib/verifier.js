var User = require('../models/user');

module.exports = {
  verifyAuthParams: function(params) {
    var validParams = ["username", "password"], attr, val;
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
