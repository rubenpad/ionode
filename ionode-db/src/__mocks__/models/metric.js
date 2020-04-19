'use strict'

const metricServiceMock = require('../lib/metricServiceMock')
const agentServiceMock = require('../lib/agentServiceMock')

// data to be used with jest mock functions
const agentUuid = agentServiceMock.findOne.uuid
const oneMetric = metricServiceMock.findOne
const metricType = oneMetric.type

// Metric service mock functions for testing
const mockMetric = {
  belongsTo: jest.fn(),
  create: jest.fn(() => ({
    // When create an user the function return created.toJSON
    // so this is the mock implementation for that functionality
    toJSON() {
      return oneMetric
    }
  })),
  // Jest (so far) doesn't provide a way to customize the response
  // of a mock according the args with it is called so the solution
  // temporary is to test the attributes from the condition passed
  // argument
  findAll: jest.fn((condition) => {
    if (condition.group) {
      return metricServiceMock.findByAgentUuid(agentUuid)
    }

    if (condition.where.type) {
      return metricServiceMock.findByTypeAgentUuid(metricType, agentUuid)
    }
  })
}

module.exports = mockMetric
