module.exports = function(req, res) {
  var user = req.user;

  if (err) {
    res.json({
      code: 500,
      message: "cannot find user"
    })
  } else {
    var people;

    user.peopleAround(function(data) {
      people = data.map(function(u) {
        return {
          id: u.id,
          name: u.name,
          longitude: u.longitude,
          latitude: u.latitude
        };
      });
      return {
        code: 200,
        people: people
      }
    });
  }
}
