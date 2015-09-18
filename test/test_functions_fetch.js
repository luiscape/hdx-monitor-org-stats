/*
 /   Testing the DataStore application.
/                                        */

/* Dependencies */
var path = require('path')
var http = require('http')
var expect = require('chai').expect
var supertest = require('supertest')

/* Application */
var Config = require('../config/dev')
var Fetch = require('../app/functions/fetch')

describe('Fetch CKAN instance data functions.', function () {
  it('FetchOrganizationInfo() should return a complete object', function (done) {
    Evaluate = function (err, data) {
      var result
      if (err) {
        result = err
      } else {
        result = data
      }
      expect(typeof result).to.equal(typeof {})
      expect(result).to.have.a.property('success')
      expect(result).to.have.a.property('message')
      done()
    }

    Fetch.FetchOrganizationInfo(undefined, Evaluate)
  })

  it('FetchOrganizationInfo() should return true when an organization id is provided.', function (done) {
    Evaluate = function (err, data) {
      var result
      if (err) {
        result = err
      } else {
        result = data
      }

      //
      // Result metadata.
      //
      expect(result).to.have.a.property('success')
      expect(result).to.have.a.property('message')
      expect(result).to.have.a.property('result')

      //
      // Restult data.
      //
      expect(result.result).to.have.a.property('users')
      expect(result.result.users).to.have.a.property('total')
      expect(result.result).to.have.a.property('datasets')
      expect(result.result.datasets).to.have.a.property('total')
      expect(result.result).to.have.a.property('downloads')
      expect(result.result.downloads).to.have.a.property('total')
      done()
    }
    Fetch.FetchOrganizationInfo('ocha-mali', Evaluate)
  })

})
