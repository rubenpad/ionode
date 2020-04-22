'use strict'

const boom = require('@hapi/boom')

function notFoundHandler(request, response) {
  const {
    output: { statusCode, payload }
  } = boom.notFound

  response.status(statusCode).json(payload)
}

module.exports = notFoundHandler
