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
  // Internal function to calculate
  // the number of downloads an
  // organization has.
  //
  var _calculate_downloads = function (data) {
    var downloads = 0
    var datasets = data.result.packages
    for (var i = 0; i < datasets.length; i++) {
      downloads += datasets[i].tracking_summary.total
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
              'count': data.result.users.length,
              'ids': null,
              'editors': _user_type(data, 'editor'),
              'admins': _user_type(data, 'admin'),
              'members': _user_type(data, 'member')
            },
            'datasets': {
              'count': data.result.package_count
            },
            'downloads': {
              'total': _calculate_downloads(data),
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
