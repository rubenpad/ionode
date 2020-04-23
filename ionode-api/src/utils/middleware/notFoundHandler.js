'use strict'

const boom = require('@hapi/boom')

// If access to a route that doesn't exist throw the 404 error
function notFoundHandler(request, response) {
  const {
    output: { statusCode, payload }
  } = boom.notFound()

  response.status(statusCode).json(payload)
}

module.exports = notFoundHandler
