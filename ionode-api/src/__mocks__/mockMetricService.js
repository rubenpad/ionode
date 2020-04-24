'use strict'

const mockMetric = require('./mockMetric')
const mockAgent = require('./mockAgent')

// data to be used with jest mock functions
const agentUuid = mockAgent.findOne.uuid
const oneMetric = mockMetric.findOne
const metricType = oneMetric.type

// Metric service mock functions for testing
const mockMetricService = {
  belongsTo: jest.fn(),
  create: jest.fn(() =>
    Promise.resolve({
      // When create an user the function return created.toJSON
      // so this is the mock implementation for that functionality
      toJSON() {
        return oneMetric
      }
    })
  ),
  // Jest (so far) doesn't provide a way to customize the response
  // of a mock according the args with it is called so the solution
  // temporary is to test the attributes from the condition passed
  // argument
  findAll: jest.fn((condition) => {
    if (condition.group) {
      return Promise.resolve(mockMetric.findByAgentUuid(agentUuid))
    }

    if (condition.where.type) {
      return Promise.resolve(
        mockMetric.findByTypeAgentUuid(metricType, agentUuid)
      )
    }
  }),
  findByAgentUuid: jest.fn((agentUuid) =>
    Promise.resolve(mockMetric.findByAgentUuid(agentUuid))
  ),

  findByTypeAgentUuid: jest.fn((metricType, agentUuid) =>
    Promise.resolve(mockMetric.findByTypeAgentUuid(metricType, agentUuid))
  )
}

module.exports = mockMetricService
