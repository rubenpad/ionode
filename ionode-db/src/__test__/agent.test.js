'use strict'

const setupDatabase = require('../')
const agentServiceMock = require('../__mocks__/agentServiceMock')

/*******************************************************************/
// jest.mock allow us to make mocks from modules we wanna test.
// So in this case I mock the Agent and Metric models to test
// the initialization of them in the database and the services
// that will be expose from them to make database queries.
const id = agentServiceMock.findOne.id
const uuid = agentServiceMock.findOne.uuid
const condition = { where: { uuid } }
const newAgent = agentServiceMock.findOne
const mockAgent = {
  hasMany: jest.fn(),
  findByPk: jest.fn(() => agentServiceMock.findById(id)),
  findOne: jest.fn(() => agentServiceMock.findByUuid(uuid)),
  update: jest.fn(() => agentServiceMock.findOne)
}
jest.mock('../models/agent', () => {
  return jest.fn(() => mockAgent)
})

const mockMetric = { belongsTo: jest.fn() }
jest.mock('../models/metric', () => {
  return jest.fn(() => mockMetric)
})

/*******************************************************************/

describe('Agent tests', () => {
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

  test('Agent.findById should be called to return an agent entity', async () => {
    const agent = await db.Agent.findById(id)
    expect(agent).toBe(agentServiceMock.findById(id))
  })

  test('Agent.createOrUpdate should be called to updated a resource', async () => {
    const agent = await db.Agent.createOrUpdate(newAgent)
    expect(mockAgent.findOne).toHaveBeenCalledTimes(1)
    expect(mockAgent.findOne).toHaveBeenCalledWith(condition)
    expect(mockAgent.update).toHaveBeenCalledTimes(1)
    expect(mockAgent.update).toHaveBeenCalledWith(newAgent, condition)
    expect(agent).toBe(newAgent)
  })
})
