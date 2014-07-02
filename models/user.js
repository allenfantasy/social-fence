var mongoose = require('./model')
  , Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  password: String,
  token: String,
  longitude: String,
  latitude: String
});

userSchema.methods = {
  isAround: function(longitude, latitude) {
    var self = this;
    // TODO: algorithms...
    return true;
  }
}

// return the 1st record by name
userSchema.static.findByName = function(name, cb) {
  this.findOne({ name: name }, cb);
}

module.exports = mongoose.model('User', userSchema);
