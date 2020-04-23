'use strict'

const express = require('express')
const supertest = require('supertest')

// Make a fake server to test the api routes
function serverTest(route) {
  const app = express()
  route(app)
  return supertest(app)
}

module.exports = serverTest
