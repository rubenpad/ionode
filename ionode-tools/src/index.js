'use strict'

// utils functions
const deepEqual = require('./utils/deepEqual')
const handleError = require('./utils/handleError')
const handleFatalError = require('./utils/handleFatalError')
const parsePayload = require('./utils/parsePayload')

// config object used in all modules
const config = require('./config')

module.exports = {
  config,
  utils: {
    deepEqual,
    handleError,
    handleFatalError,
    parsePayload,
    config
  }
}
