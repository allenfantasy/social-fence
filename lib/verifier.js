var User = require('../models/user');

function check(validParams, params) {
  var attr, val;
  for(var i=0; i < validParams.length; i++) {
    attr = validParams[i]
    val = params[attr];
    if (!val) {
      return { err: 'missing ' + name };
    }
  }
  return params;
}

module.exports = {
  verifyAuthParams: function(params) {
    return check(["username", "password"], params);
  },
  verifyPingParams: function(params) {
    return check(["id", "token", "longitude", "latitude"], params);
  }
}
