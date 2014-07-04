var mongoose = require('./model')
  , Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  password: String,
  token: String,
  longitude: String,
  latitude: String
});

function distance(a, b) {
  var lat1 = a[0], lon1 = a[1];
  var lat2 = b[0], lon2 = b[1];
  var R = 6371;
  var a =
     0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 +
     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
     (1 - Math.cos((lon2 - lon1) * Math.PI / 180))/2;

  return R * 2 * Math.asin(Math.sqrt(a)) * 1000;
}

userSchema.methods = {
  isAround: function(latitude, longitude) {
    var targetPosition = [latitude, longitude];
    var selfPosition = [this.latitude, this.longitude];

    return distance(targetPosition, selfPosition) <= 1500;
  },
  peopleAroundMe: function(cb) {
    var result = []
      , longitude = this.longitude
      , latitude = this.latitude, user;

    User.find(function(err, users) {
      if (err) return [];
      for(var i=0; i < users.length; i++) {
        user = users[i];
        if (user.isAround(latitude, longitude)) result.push(users[i]);
      }
      cb(result);
    });
  },
}

// return the 1st record by name
userSchema.static.findByName = function(name, cb) {
  this.findOne({ name: name }, cb);
}

module.exports = mongoose.model('User', userSchema);
