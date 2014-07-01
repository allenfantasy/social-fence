var mongoose = require('./model')
  , Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  password: String,
  token: String,
  longitude: String,
  latitude: String
});

module.exports = mongoose.model('User', userSchema);
