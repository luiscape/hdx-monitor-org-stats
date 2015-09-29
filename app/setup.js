var path = require('path')
var mkdirp = require('mkdirp')
var sqlite = require('sqlite3').verbose()

var CreateFolder = function (instance, verbose) {
  //
  // Tries to load the instance.
  //
  try {
    var config = require('../config/' + instance)
    var data_folder = config.DataFolder
  } catch (err) {
    if (verbose) {
      console.log(err)
    }
    return false
  }

  //
  // Proceeds to create a folder.
  //
  mkdirp(data_folder, function (err) {
    if (err) {
      console.log('Could not create ' + data_folder + ' directory.')
      if (verbose) {
        console.error(err)
      }
      return false
    } else {
      if (verbose) {
        console.log(data_folder + ' directory created successfully.')
      }
    }
  })
}

var CreateDatabase = function (instance) {
  //
  // Creates database in
  // specified path.
  //
  var config = require('../config/' + instance)
  var location = path.join(config.DataFolder, 'org_stats_db.sqlite')
  var db = new sqlite.Database(location)

  //
  // Tries to create table
  // and closes connection.
  //
  try {
    db.serialize(function (callback) {
      //
      // Create schema string.
      //
      var schema = ''
      var keys = Object.keys(config.database[0].schema)
      for (var i = 0; i < keys.length; i++) {
        schema += keys[i] + ' ' + config.database[0].schema[keys[i]] + ', '
      }
      var primary_key = 'PRIMARY KEY (organization, date)'
      var statement = 'CREATE TABLE IF NOT EXISTS ' + config.database[0].name + ' (' + schema + primary_key + ')'
      db.run(statement, function (err, data) {
        if (err) {
          if (err.code === 'SQLITE_ERROR') {
            console.log('ERROR: ' + err)
          }
        } else {
          console.log('SUCCESS: Database and table created successfully.')
        }
      })
    })
    db.close()
  } catch (err) {
    console.log(err)
  }
  return false

}

//
// Invoking function.
//
module.exports = {
  CreateFolder: CreateFolder('dev.js', false),
  CreateDatabase: CreateDatabase('dev.js')
}
