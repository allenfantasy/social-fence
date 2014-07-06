var mongoose = require('./model')
  , Schema = mongoose.Schema
  , util = require('../lib/util')
  , distance = util.distance;

var userSchema = new Schema({
  name: String,
  password: String,
  token: String,
  longitude: String,
  latitude: String
});

userSchema.methods = {
  isAround: function(latitude, longitude) {
    var targetPosition = [latitude, longitude];
    var selfPosition = [this.latitude, this.longitude];

    return distance(targetPosition, selfPosition) <= 1500;
  },
  peopleAround: function(cb) {
    var result = []
      , longitude = this.longitude
      , latitude = this.latitude, user;

    User.find(function(err, users) {
      if (err) return [];
      for(var i=0; i < users.length; i++) {
        user = users[i];
        if (user.isAround(latitude, longitude)) result.push(user);
      }
      cb(result);
    });
  },

  questionsAround: function() {
    var ids, id, results = [], date;

    this.peopleAroundMe(function(data) {
      // 1. get people nearby, get peopleIds
      ids = data.map(function(u) { return u.id; });
      date = new Date();
      // 2. find questions by peopleIds
      for(var i = 0; i < ids.length; i++) {
        id = ids[i];
        date.setTime(date.getTime() - (30 * 60 * 1000))
        Message.find({ senderId: id, createdAt: { $gte: date }, type: 0 }, function(err, questions) {
          if (err) {
            return { err: 'something wrong with getQuestions' };
          }
          else {
            results << questions;
            if (results.length == ids.length) {
              return [].concat.apply([], results);
            }
          }
        });
      }
    });
  },

  getAnswers: function() {
    // TODO: answers should be stored in memory(not in db)... Redis?

    // 1. find all questions of user in 30mins, get questionIds;
    var date = new Date(), question;
    date.setTime(date.getTime() - (30 * 60 * 1000));

    var results = [];

    Message.find({ senderId: this.id, createdAt: { $gte: date }, type: 0 }, function(err, questions) {
      if (err) {
        return { err: 'something wrong with getAnswersFor:find questions' };
      }
      // 2. find answers by questionIds
      for(var i = 0; i < questions.length; i++) {
        question = questions[i];
        Message.find({ questionId: question.id, type: 2 }, function(err, answers) {
          if (err) {
            return { err: 'something wrong with getAnswersFor:find answers' };
          }
          results.push({
            question_id: question.id,
            answers: answers
          });

          // update these answers: we don't wait you guys
          answers.forEach(function(answer) {
            answer.type = 2;
            answer.save(function(err) {
              if (err) {
                console.log("oh fuck. update answer's status failed: " + answer.id);
              }
              else {
                console.log('update type=2 for answer: ' + answer.id);
              }
            });
          });
          if (results.length === questions.length) {
            return results;
          }
        });
      }
    });
  }
}

// return the 1st record by name
userSchema.static.findByName = function(name, cb) {
  this.findOne({ name: name }, cb);
}

module.exports = mongoose.model('User', userSchema);
