var crypto = require('crypto');

var keywordBase = ['吃', '唱K', '玩', '喝', '住宿', '餐厅', '酒店', '旅馆', '邮局', '银行'];

module.exports = {
  distance: function(pointA, pointB) {
    var lat1 = pointA[0], lon1 = pointA[1];
    var lat2 = pointB[0], lon2 = pointB[1];
    var R = 6371; // radius of Earth
    var tmp =
       0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 +
       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
       (1 - Math.cos((lon2 - lon1) * Math.PI / 180))/2;

    return R * 2 * Math.asin(Math.sqrt(tmp)) * 1000;
  },
  encode: function(data) {
    return crypto.createHash('md5').update(data).digest('base64');
  },
  getToken: function(username, password) {
    var array = [username, password, new Date().getTime().toString()].sort();
    return crypto.createHash('md5').update(array).digest('base64');
  },
  similarity: function(subject, object) {
    var key, subScore, objScore;
    var score = 0;
    for(var i = 0; i < keywordBase.length; i++) {
      key = keywordBase[i];
      subScore = this._occurrence(subject, key);
      if (subScore != 0) {
        objScore = this._occurrence(object, key);
        score += objScore;
      }
    }
    return score;
  },
  _occurrence: function(string, key) {
    var regExp = new RegExp(key, 'g'); // global match
    return (string.match(regExp) || []).length
  }
}
