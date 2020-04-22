'use strict'

const boom = require('@hapi/boom')
const { config } = require('ionode-tools')

// Validate work environment and according that
// decide if shows the error with stack or without it
function validateEnvironment(error, stack) {
  if (config.dev) {
    return { ...error, stack }
  }

  return error
}

function logErrors(error, request, response, next) {
  next(error)
}

function wrapErrors(error, request, response, next) {
  if (!error.isBoom) {
    next(boom.badImplementation(error))
  }

  next(error)
}

function errorHandler(error, request, response, next) {
  const {
    output: { statusCode, payload }
  } = error

  response.status(statusCode).json(validateEnvironment(payload, error.stack))
}

module.exports = { logErrors, wrapErrors, errorHandler }
