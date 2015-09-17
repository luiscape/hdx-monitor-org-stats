//
// DataTeam monitor interface
// for the DataStore API.
//
var Fetch = require('./functions/fetch')

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
      'message': 'Service for creating datastores on a CKAN instance.',
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
        res.send(data)
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
