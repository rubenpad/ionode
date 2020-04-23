'use strict'

// utils functions
const deepEqual = require('./utils/deepEqual')
const handleError = require('./utils/handleError')
const handleFatalError = require('./utils/handleFatalError')
const parsePayload = require('./utils/parsePayload')

// mocks used in several test cases - ionode-db - ionode-api
const mockAgent = require('./__mocks__/mockAgent')
const mockAgentService = require('./__mocks__/mockAgentService')
const mockMetric = require('./__mocks__/mockMetric')
const mockMetricService = require('./__mocks__/mockMetricService')

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
  },
  mocks: {
    mockAgent,
    mockAgentService,
    mockMetric,
    mockMetricService
  }
}
