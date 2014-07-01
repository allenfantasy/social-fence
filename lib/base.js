var crypto = require('crypto');
module.exports = {
  encode: function(data) {
    return crypto.createHash('md5').update(data).digest('base64');
  },
  getToken: function(username, password) {
    var array = [username, password, new Date().getTime().toString()].sort();
    return crypto.createHash('md5').update(array).digest('base64');
  }
}
