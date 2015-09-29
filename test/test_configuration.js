/*
 /   Testing the configuration files.
/                                      */

/* Dependencies */
var fs = require('fs')
var path = require('path')
var should = require('should')
var expect = require('chai').expect

/* Application */
var Dev = require('../config/dev')
var Prod = require('../config/prod')

/* Tests */
describe('Configuration files.', function () {
  it('Configuration files should be JSON objects.', function (done) {
    expect(typeof (Dev)).to.equal('object')
    expect(typeof (Prod)).to.equal('object')
    done()
  })

  it('Configuration files should contain CKAN (default) instance.', function (done) {
    expect(Dev).to.have.a.property('CkanInstance')
    expect(Prod).to.have.a.property('CkanInstance')
    done()
  })

  it('Configuration files should contain database properties.', function (done) {
    expect(Dev).to.have.a.property('database')
    expect(Prod).to.have.a.property('database')

    expect(Dev.database[0]).to.have.a.property('name')
    expect(Dev.database[0]).to.have.a.property('schema')
    expect(Prod.database[0]).to.have.a.property('name')
    expect(Prod.database[0]).to.have.a.property('schema')
    done()
  })

})
