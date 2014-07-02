var crypto = require('crypto');

module.exports = {
  encode: function(data) {
    return crypto.createHash('md5').update(data).digest('base64');
  },
  getToken: function(username, password) {
    var array = [username, password, new Date().getTime().toString()].sort();
    return crypto.createHash('md5').update(array).digest('base64');
  },
  getPeople: function(longitude, latitude) {
    // TODO
    var result = [];
    User.find(function(err, users) {
      if (err) return [];
      for(var i=0; i < users.length; i++) {
        if (user.isAround(longitude, latitude)) result.push(users[i]);
      }
    })
    return result;
  },
  getQuestions: function() {
    // TODO
    // 1. get people nearby, get peopleIds
    // 2. find questions by peopleIds
    return [];
  },
  getAnswers: function(userId) {
    // TODO
    // 1. find all questions of user in 30mins, get questionIds;
    // 2. find answers by questionIds
    // ! answers should be stored in memory(not in db)... Redis?
    return [];
  }
}
