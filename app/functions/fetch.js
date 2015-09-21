//
// Starting CKAN client.
//
var ckan = require('ckan')
var _ = require('lodash-node')
var Config = require('../../config/dev.js')
var client = new ckan.Client(Config.CkanInstance, Config.ApiKey)

//
// Fetch organization information.
//
var FetchOrganizationInfo = function (organization_id, callback) {
  //
  // Internal function to calculate
  // the number of users per type.
  //
  var _user_type = function (data, type) {
    var count = 0
    var users = data.result.users
    for (var i = 0; i < users.length; i++) {
      if (users[i].capacity === type) {
        count += 1
      }
    }
    return count
  }

  //
  // Internal function to organize
  // users based on their details.
  //
  var _user_details = function (data, type) {
    var details = []
    var users = data.result.users
    for (var i = 0; i < users.length; i++) {
      if (users[i].capacity === type) {
        details.push(users[i].name)
      }
    }
    return details
  }

  //
  // Internal function to calculate
  // the number of downloads an
  // organization has.
  //
  var _calculate_views = function (data, property) {
    var views = 0
    var datasets = data.result.packages
    for (var i = 0; i < datasets.length; i++) {
      views += datasets[i].tracking_summary[property]
    }
    return views
  }

  //
  // Internal function to calculate
  // the number of downloads
  // each resource of a dataset has.
  //
  var _calculate_downloads = function (datasets, property) {
    var downloads = 0

    //
    // Calculate mean if required.
    //
    if (property === 'mean') {
      var divisor = 0
      var dividend = 0
      for (var i = 0; i < datasets.length; i++) {
        var d = datasets[i]
        divisor += 1
        for (var j = 0; j < d.resources.length; j++) {
          dividend += d.resources[j].tracking_summary.total
        }
      }
      var quotient = dividend / divisor
      return Math.ceil(quotient)

    //
    // If the 'mean' is not provided,
    // calculate the number of downloads.
    //
    } else {
      for (var i = 0; i < datasets.length; i++) {
        var d = datasets[i]
        for (var j = 0; j < d.resources.length; j++) {
          downloads += d.resources[j].tracking_summary[property]
        }
      }
      return downloads
    }
  }

  //
  // Internal function to
  // organize data into a detailed view.
  //
  var _details_views = function (data) {
    var d
    var details = []
    var datasets = data.result.packages
    for (var i = 0; i < datasets.length; i++) {
      d = {
        'id': datasets[i].id,
        'name': datasets[i].title,
        'views': datasets[i].tracking_summary.total
      }
      details.push(d)
    }
    return details
  }

  //
  // Internal function to
  // organize data into a deatiled downloads.
  //
  var _details_downloads = function (datasets) {
    var d
    var details = []
    for (var i = 0; i < datasets.length; i++) {
      d = {
        'id': datasets[i].id,
        'name': datasets[i].title,
        'downloads': _.sum(datasets[i].resources, function (d) { return d.tracking_summary.total })
      }
      details.push(d)
    }
    return details
  }

  //
  // Internal function to calculate
  // a mean.
  //
  var _mean_views = function (data, property) {
    var dividend = 0
    var divisor = data.length
    for (var i = 0; i < divisor; i++) {
      dividend += data[i][property].total
    }
    var quotient = dividend / divisor
    return Math.ceil(quotient)
  }

  var payload
  if (organization_id === undefined) {
    payload = {
      'success': false,
      'message': 'Please provide an organization ID.'
    }
    callback(payload)
  } else {
    FetchDownloads(organization_id, function (err, data) {
      if (err) {
        res.send(err)
      } else {
        var downloads = data
        client.action('organization_show', { id: organization_id }, function (err, data) {
          if (!err) {
            payload = {
              'success': true,
              'message': 'Fetched organization information successfully.',
              'organization': organization_id,
              'result': {
                'users': {
                  'total': data.result.users.length,
                  'admins': _user_type(data, 'admin'),
                  'editors': _user_type(data, 'editor'),
                  'members': _user_type(data, 'member'),
                  'details': {
                    'admins': _user_details(data, 'admin'),
                    'editors': _user_details(data, 'editor'),
                    'members': _user_details(data, 'member')
                  }
                },
                'datasets': {
                  'total': data.result.package_count,
                  'views': {
                    'total': _calculate_views(data, 'total'),
                    'recent': _calculate_views(data, 'recent'),
                    'mean': _mean_views(data.result.packages, 'tracking_summary'),
                    'details': _details_views(data)
                  },
                  'downloads': {
                    'total': _calculate_downloads(downloads, 'total'),
                    'recent': _calculate_downloads(downloads, 'recent'),
                    'mean': _calculate_downloads(downloads, 'mean'),
                    'details': _details_downloads(downloads)
                  }
                }
              }
            }
            callback(null, payload)
          } else {
            payload = {
              'success': false,
              'message': 'Failed to fetch organization information.',
              'error': err
            }
            callback(payload)
          }
        })

      }

    })
  }
}

//
// Function to fetch the organization info
// and calculate the number of downloads
// for each resource.
//
var FetchDownloads = function (organization_id, callback) {
  client.action('package_search', { fq: 'organization:' + organization_id, rows: 10000 }, function (err, data) {
    if (!err) {
      callback(null, data.result.results)
    } else {
      payload = {
        'success': false,
        'message': 'Failed to fetch resource information.',
        'error': err
      }
      callback(payload)
    }

  })
}

//
// Exporting functions.
//
module.exports = {
  FetchOrganizationInfo: FetchOrganizationInfo
}
