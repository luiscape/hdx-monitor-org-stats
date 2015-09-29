var path = require('path')
var moment = require('moment')
var sqlite = require('sqlite3').verbose()

//
// Internal function to parse
// records from the API.
//
var _parse = function (record) {
  var out = {
    'organization': record.organization,
    'date': moment().format('YYYY-MM-DD'),
    'number_of_datasets': record.result.datasets.total,
    'total_views': record.result.datasets.views.total,
    'recent_views': record.result.datasets.views.recent,
    'mean_views': record.result.datasets.views.mean,
    'total_downloads': record.result.datasets.downloads.total,
    'recent_downloads': record.result.datasets.downloads.recent,
    'mean_downloads': record.result.datasets.downloads.mean
  }
  return out
}

//
// Function to store records
// in a SQLite database.
//
var StoreRecords = function (config, table, record, callback) {
  var location = path.join(config.DataFolder, 'org_stats_db.sqlite')
  var db = new sqlite.Database(location)

  //
  // Parse record.
  //
  var r = _parse(record)

  db.serialize(function () {
    var keys = Object.keys(r)
    var values = ''
    for (var i = 0; i < keys.length; i++) {
      if (i === 0 || i === 1) {
        values += '"' + r[keys[i]] + '"'
      } else {
        values += r[keys[i]]
      }
      if (i < keys.length - 1) {
        values += ', '
      } else {
        continue
      }
    }

    //
    // Store record in database.
    //
    var s = 'INSERT INTO ' + table + ' VALUES (' + values + ')'
    db.run(s, function (err, data) {
      if (err) {
        if (err.errno === 19) {
          callback(null, data)
        } else {
          callback(err)
        }
      } else {
        callback(null, data)
      }
    })

    db.close()

  })

}

module.exports = {
  StoreRecords: StoreRecords
}
