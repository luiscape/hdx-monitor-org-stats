//
// Starting CKAN client.
//
var ckan = require('ckan')
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
  var _calculate_downloads = function (data, property) {
    var downloads = 0
    var datasets = data.result.packages
    for (var i = 0; i < datasets.length; i++) {
      downloads += datasets[i].tracking_summary[property]
    }
    return downloads
  }

  //
  // Internal function to
  // organize data into a detailed view.
  //
  var _details = function (data) {
    var d
    var details = []
    var datasets = data.result.packages
    for (var i = 0; i < datasets.length; i++) {
      d = {
        'id': datasets[i].id,
        'name': datasets[i].title,
        'downloads': datasets[i].tracking_summary.total
      }
      details.push(d)
    }
    return details
  }

  //
  // Internal function to calculate
  // a mean.
  //
  var _mean = function (data, property) {
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
              'total': data.result.package_count
            },
            'downloads': {
              'total': _calculate_downloads(data, 'total'),
              'recent': _calculate_downloads(data, 'recent'),
              'mean': _mean(data.result.packages, 'tracking_summary'),
              'details': _details(data)
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
}

//
// Exporting functions.
//
module.exports = {
  FetchOrganizationInfo: FetchOrganizationInfo
}
