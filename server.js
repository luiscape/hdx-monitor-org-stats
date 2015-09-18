var cors = require('cors')
var morgan = require('morgan')
var express = require('express')
var bodyParser = require('body-parser')

var StartApplication = function (instance) {
  if (instance === undefined) {
    instance = 'dev'
  }
  //
  // App variables.
  //
  var app = express()
  var port = process.env.PORT || 2000
  var config = require('./config/' + instance)

  //
  // Configure CORS and body parser.
  //
  app.use(cors())
  app.use(morgan('dev'))
  app.use(bodyParser.json({ type: 'application/*+json' }))
  app.use(bodyParser.urlencoded({ extended: false }))

  //
  // Load routes and start application.
  //
  require('./app/routes.js')(app, config)
  app.listen(port)
  console.log('Organization stats service (' + config['version'] + ') running on port: ' + port)
}

//
// Invoking function.
//
var main = function () {
  StartApplication(process.argv[2])
}

if (require.main === module) {
  main()
}
