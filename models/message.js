var mongoose = require('./model')
  , Schema = mongoose.Schema
  , util = require('../lib/util')
  , distance = util.distance;

/*
 * type:
 *   0: question
 *   1: answer proposed
 *   2: answer sent
 */
var messageSchema = new Schema({
  body: String,
  senderId: String,
  receiverId: String,
  questionId: String, // only for type = 1,2
  //type: { type: Number, min: 0, max: 1 }
  type: Number,
  createdAt: Date,
  longitude: String, // for type = 0
  latitude: String // for type = 0
});

messageSchema.methods = {
  isAround: function(question) {
    return distance(
      [this.latitude, this.longitude],
      [question.latitude, question.longitude]) <= 1500;
  },
  _similarity: function(question) {
    return util.similarity(this.boby, question.body);
  },
  _similarQuestions: function() {
    // TODO: select top 3 questions
    var question, results = [];
    var me = this;
    Message.find({ type: 0 }, function(err, questions) {
      if (err) return [];
      results =  questions.sort(function(a, b) {
        var simA = a._similarity(me)
          , simB = b._similarity(me);
        if (simA < simB) {
          return -1;
        } else {
          return 1;
        }
        return 0;
      })
      return results.slice(0, 3);
    });
  },

  // only for questions
  answer: function() {
    if (this.type !== 0) return null;
    Message.findOne({ questionId: this.id }, function(err, answer) {
      if (err) return null;
      return answer;
    });
  },

  bestAnswers: function() {
    var answers = this._similarQuestions().map(function(question){
      return question.answer;
    });

    return answers;
  }
}

//messageSchema.static.xxx = function(xxx, cb) {
//}

module.exports = mongoose.model('Message', messageSchema);
