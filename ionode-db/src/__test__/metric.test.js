'use strict'

// Tell to jest when agent and metric are required in `index.js`
// use the mock from them. jest.mock() takes a moduleFactory
// argument as a second argument that returns the mock and with it
// we can specify what mock to use.
const mockAgent = require('../__mocks__/mockAgent')
const mockAgentService = require('../__mocks__/mockAgentService')
jest.mock('../models/agent', () => jest.fn(() => mockAgentService))

const mockMetric = require('../__mocks__/mockMetric')
const mockMetricService = require('../__mocks__/mockMetricService')
jest.mock('../models/metric', () => jest.fn(() => mockMetricService))

const setupDatabase = require('../')

// Data to use in the tests
const oneAgent = mockAgent.findOne
const agentUuid = oneAgent.uuid

const oneMetric = mockMetric.findOne
const metricType = oneMetric.type
const metricsByAgentUuid = mockMetric.findByAgentUuid(agentUuid)
const metricsByTypeAgentUuid = mockMetric.findByTypeAgentUuid(
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
    expect(mockMetricService.belongsTo).toHaveBeenCalled()
  })

  test('MetricModel.belongsTo should be called with AgentModel', () => {
    expect(mockMetricService.belongsTo).toHaveBeenCalledWith(mockAgentService)
  })

  test('Metric.create should create a new metric', async () => {
    const createdMetric = await db.Metric.create(agentUuid, oneMetric)
    expect(createdMetric).toBe(oneMetric)
  })

  test('Metric.findByAgentUuid should returns metrics from the same agent', async () => {
    const metricsGroupedByAgentUuid = await db.Metric.findByAgentUuid(agentUuid)
    expect(mockMetricService.findAll).toHaveBeenCalledTimes(1)
    expect(metricsGroupedByAgentUuid).toStrictEqual(metricsByAgentUuid)
  })

  test('Metric.findByTypeAgentUuid should returns metrics with the same type and owned by the same agent', async () => {
    const metricsGroupedByTypeAgentUuid = await db.Metric.findByTypeAgentUuid(
      metricType,
      agentUuid
    )
    expect(mockMetricService.findAll).toHaveBeenCalledTimes(1)
    expect(metricsGroupedByTypeAgentUuid).toStrictEqual(metricsByTypeAgentUuid)
  })
})
