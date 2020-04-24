'use strict'

const boom = require('@hapi/boom')

function validationHandler() {
  return function (request, response, next) {
    const { user } = request

    if (!user || !user.username) {
      return next(boom.unauthorized())
    }

    next()
  }
}

module.exports = validationHandler
