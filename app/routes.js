//
// DataTeam monitor interface
// for the DataStore API.
//
var Fetch = require('./functions/fetch')
var Store = require('./functions/store')
var Historic = require('./functions/historic')

module.exports = function (app, Config) {
  //
  // Global variable of dataset.
  //
  var organizationInfo = {}

  //
  // ROUTES =============================================================
  //

  //
  // Status endpoint.
  //
  app.get('/status', function (req, res) {
    var payload = {
      'online': true,
      'message': Config.description,
      'CKAN_instance': Config.CkanInstance,
      'version': Config.version,
      'repository': Config.repository
    }
    res.send(payload)
  })

  //
  // Collect resource id from parameter.
  //
  app.param('organization_id', function (req, res, next, data) {
    if (data === undefined || data === null) {
      var payload = { 'success': false, 'message': 'Please provide an organization ID.' }
      res.send(payload)
    }
    organizationInfo['id'] = data
    next()
  })

  app.get('/', function (req, res) {
    var payload = { 'success': false, 'message': 'Please provide an organization ID.' }
    res.send(payload)
  })

  app.get('/:organization_id', function (req, res) {
    Fetch.FetchOrganizationInfo(organizationInfo.id, function (err, data) {
      if (err) {
        res.send(err)
      } else {
        Store.StoreRecords(Config, Config.database[0].name, data, function (err, record) {
          if (err) {
            console.log(err)
            var payload = {
              'success': false,
              'message': 'Failed to store record in database.',
              'error': err
            }
            res.send(payload)
          } else {
            res.send(data)
          }
        })
      }
    })
  })

  //
  // Endpoint for fetching
  // time-series data.
  //
  app.get('/historic/:organization_id', function (req, res) {
    Historic.FetchAllRecords(Config, organizationInfo.id, function (err, data) {
      if (err) {
        var payload = {
          'success': false,
          'message': 'Failed to fetch historic organization records.',
          'organization': organizationInfo.id,
          'error': err
        }
        res.send(payload)
      } else {
        var payload = {
          'success': true,
          'message': 'Successfully fetched historic organization records.',
          'organization': organizationInfo.id,
          'result': {
            'count': data.length,
            'records': data
          }
        }
        res.send(payload)
      }
    })
  })

  //
  // 404 route.
  //
  app.use(function (req, res, next) {
    res.status(404)
    var payload = {
      'success': false,
      'message': 'Endpoint not found.'
    }
    res.send(payload)
  })

}  // module.exports closes.
