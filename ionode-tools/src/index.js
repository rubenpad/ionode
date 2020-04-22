'use strict'

const deepEqual = require('./utils/deepEqual')
const handleError = require('./utils/handleError')
const handleFatalError = require('./utils/handleFatalError')
const parsePayload = require('./utils/parsePayload')
const config = require('./config')

module.exports = {
  deepEqual,
  handleError,
  handleFatalError,
  parsePayload,
  config
}
