var crypto = require('crypto');

module.exports = {
  encode: function(data) {
    return crypto.createHash('md5').update(data).digest('base64');
  },
  getToken: function(username, password) {
    var array = [username, password, new Date().getTime().toString()].sort();
    return crypto.createHash('md5').update(array).digest('base64');
  },
  getQuestions: function(user, cb) {
    var ids;

    user.peopleAroundMe(function(data) {
      // 1. get people nearby, get peopleIds
      ids = data.map(function(u) { return u.id; });
      // 2. find questions by peopleIds
    });
    return [];
  },
  getAnswers: function(user) {
    // TODO
    // 1. find all questions of user in 30mins, get questionIds;
    // 2. find answers by questionIds
    // ! answers should be stored in memory(not in db)... Redis?
    return [];
  }
}
