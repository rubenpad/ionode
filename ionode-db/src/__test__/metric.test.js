'use strict'

// Tell to jest when agent and metric are required in `index.js`
// use the mock from them. jest.mock() takes a moduleFactory
// argument as a second argument that returns the mock and with it
// we can specify what mock to use.
const { mocks } = require('ionode-tools')
jest.mock('../models/agent', () => jest.fn(() => mocks.mockAgentService))
jest.mock('../models/metric', () =>
  jest.fn(() => mocks.mockMetricService)
)

const setupDatabase = require('../')

// Data to use in the tests
const oneAgent = mocks.mockAgent.findOne
const agentUuid = oneAgent.uuid

const oneMetric = mocks.mockMetric.findOne
const metricType = oneMetric.type
const metricsByAgentUuid = mocks.mockMetric.findByAgentUuid(agentUuid)
const metricsByTypeAgentUuid = mocks.mockMetric.findByTypeAgentUuid(
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
    expect(mocks.mockMetricService.belongsTo).toHaveBeenCalled()
  })

  test('MetricModel.belongsTo should be called with AgentModel', () => {
    expect(mocks.mockMetricService.belongsTo).toHaveBeenCalledWith(
      mocks.mockAgentService
    )
  })

  test('Metric.create should create a new metric', async () => {
    const createdMetric = await db.Metric.create(agentUuid, oneMetric)
    expect(createdMetric).toBe(oneMetric)
  })

  test('Metric.findByAgentUuid should returns metrics from the same agent', async () => {
    const metricsGroupedByAgentUuid = await db.Metric.findByAgentUuid(agentUuid)
    expect(mocks.mockMetricService.findAll).toHaveBeenCalledTimes(1)
    expect(metricsGroupedByAgentUuid).toStrictEqual(metricsByAgentUuid)
  })

  test('Metric.findByTypeAgentUuid should returns metrics with the same type and owned by the same agent', async () => {
    const metricsGroupedByTypeAgentUuid = await db.Metric.findByTypeAgentUuid(
      metricType,
      agentUuid
    )
    expect(mocks.mockMetricService.findAll).toHaveBeenCalledTimes(1)
    expect(metricsGroupedByTypeAgentUuid).toStrictEqual(metricsByTypeAgentUuid)
  })
})
