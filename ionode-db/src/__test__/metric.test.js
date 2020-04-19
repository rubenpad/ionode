'use strict'

// Tell to jest when agent and metric are required in `index.js`
// use the mock from them. jest.mock() takes a moduleFactory
// argument as a second argument that returns the mock and with it
// we can specify what mock to use.
const mockAgent = require('../__mocks__/models/agent')
jest.mock('../models/agent', () => jest.fn(() => mockAgent))
const mockMetric = require('../__mocks__/models/metric')
jest.mock('../models/metric', () => jest.fn(() => mockMetric))

const setupDatabase = require('../')
const metricServiceMock = require('../__mocks__/lib/metricServiceMock')
const agentServiceMock = require('../__mocks__/lib/agentServiceMock')

// Data to use in the tests
const oneAgent = agentServiceMock.findOne
const agentUuid = oneAgent.uuid

const oneMetric = metricServiceMock.findOne
const metricType = oneMetric.type
const metricsByAgentUuid = metricServiceMock.findByAgentUuid(agentUuid)
const metricsByTypeAgentUuid = metricServiceMock.findByTypeAgentUuid(
  metricType,
  agentUuid
)

describe('Metric tests', () => {
  let db = null
  const config = { logging: false }

  beforeEach(async () => {
    db = await setupDatabase(config)
  })

  afterEach(() => {
    // After each test clear all mocks because one implementation
    // can be used in many test cases so it doesn't accumulate
    // the times had been called
    jest.clearAllMocks()
  })

  test('Metric should be returned', () => {
    expect(db.Metric).toBeTruthy()
  })

  test('MetricModel.belongsTo should be called', () => {
    expect(mockMetric.belongsTo).toHaveBeenCalled()
  })

  test('MetricModel.belongsTo should be called with AgentModel', () => {
    expect(mockMetric.belongsTo).toHaveBeenCalledWith(mockAgent)
  })

  test('Metric.create should create a new metric', async () => {
    const createdMetric = await db.Metric.create(agentUuid, oneMetric)
    expect(createdMetric).toBe(oneMetric)
  })

  test('Metric.findByAgentUuid should returns metrics from the same agent', async () => {
    const metricsGroupedByAgentUuid = await db.Metric.findByAgentUuid(agentUuid)
    expect(mockMetric.findAll).toHaveBeenCalledTimes(1)
    expect(metricsGroupedByAgentUuid).toStrictEqual(metricsByAgentUuid)
  })

  test('Metric.findByTypeAgentUuid should returns metrics with the same type and owned by the same agent', async () => {
    const metricsGroupedByTypeAgentUuid = await db.Metric.findByTypeAgentUuid(
      metricType,
      agentUuid
    )
    expect(mockMetric.findAll).toHaveBeenCalledTimes(1)
    expect(metricsGroupedByTypeAgentUuid).toStrictEqual(metricsByTypeAgentUuid)
  })
})
