'use strict'

const setupDatabase = require('../')
const AgentModel = require('../models/agent')
const MetricModel = require('../models/metric')

const mockAgent = { hasMany: jest.fn() }
jest.mock('../models/agent', () => {
  return jest.fn(() => mockAgent)
})

const mockMetric = { belongsTo: jest.fn() }
jest.mock('../models/metric', () => {
  return jest.fn(() => mockMetric)
})

let db = null
const config = { logging: false }

beforeEach(async () => {
  db = await setupDatabase(config)
})

test('Should exists the Agent service', () => {
  expect(db.Agent).toBeTruthy()
})

test('mockAgent.hasMany should be called', () => {
  expect(mockAgent.hasMany).toHaveBeenCalled()
})

test('mockAgent.hasMany should be called with mockMetric', () => {
  expect(mockAgent.hasMany).toHaveBeenCalledWith(mockMetric)
})

test('mockMetric.belongsTo should be called', () => {
  expect(mockMetric.belongsTo).toHaveBeenCalled()
})

test('mockMetric.belongsTo should be called with mockAgent', () => {
  expect(mockMetric.belongsTo).toHaveBeenCalledWith(mockAgent)
})
