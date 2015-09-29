var path = require('path')
var sqlite = require('sqlite3').verbose()

var FetchAllRecords = function (config, id, callback) {
  //
  // Open database connection.
  //
  var location = path.join(config.DataFolder, 'org_stats_db.sqlite')
  var db = new sqlite.Database(location)

  //
  // Fetch all records.
  //
  db.serialize(function () {
    var s = 'SELECT * FROM historic WHERE organization="' + id + '"'
    db.all(s, [], function (err, rows) {
      var payload = []
      if (err) {
        console.log(err)
        callback(err)
      } else {
        console.log(rows.length)
        for (var i = 0; i < rows.length; i++) {
          payload.push(rows[i])
        }
        callback(null, rows)
      }
    })
    db.close()

  })

}

module.exports = {
  FetchAllRecords: FetchAllRecords
}
