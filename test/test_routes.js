//
// Tests configuration files.
//
var fs = require('fs')
var path = require('path')
var chai = require('chai')
var http = require('http')
var should = require('should')
var chaiHttp = require('chai-http')
var expect = require('chai').expect

//
// Configuring Chai to use http.
//
chai.use(chaiHttp)

describe('Application routes.', function () {
  var application = chai.request('http://localhost:2000')

  it('GET [/status] should return 200 status.', function (done) {
    application
      .get('/status')
      .end(function (err, res) {
        expect(res.status).to.equal(200)
        done()
      })
  })

  it('GET [/status] to have complete status object.', function (done) {
    application
      .get('/status')
      .end(function (err, res) {
        expect(res.body).to.have.a.property('online')
        expect(res.body).to.have.a.property('message')
        expect(res.body).to.have.a.property('version')
        expect(res.body).to.have.a.property('repository')
        done()
      })
  })

  it('GET [/] should return 200 status.', function (done) {
    application
      .get('/')
      .end(function (err, res) {
        expect(res.status).to.equal(200)
        done()
      })
  })

  it('GET [/404] should return a 404 status code.', function (done) {
    application
      .get('/foo/404')
      .end(function (err, res) {
        expect(res.status).to.equal(404)
        done()
      })
  })

  it('GET [/404] should return a page not found message.', function (done) {
    application
      .get('/foo/404')
      .end(function (err, res) {
        expect(res.body.success).to.equal(false)
        expect(res.body).to.have.a.property('success')
        expect(res.body).to.have.a.property('message')
        done()
      })
  })

})
