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
    return check(["longitude", "latitude"], params);
  },
  verifyAskParams: function(params) {
    return check(["body"], params);
  },
  verifyAskallParams: function(params) {
    return check(["question_id"], params);
  },
  verifyAnswerParams: function(params) {
    return check(["body","question_id"], params);
  }
}
