'use strict'

const setupDatabase = require('../')
const agentServiceMock = require('../__mocks__/agentServiceMock')

// Jest (so far) doesn't provide a way to customize the response
// of a mock according the args with it is called so the solution
// temporary is to test deepEquality between two objects with an
// util function `deepEqual`
const { deepEqual } = require('../utils/deepEqual')

/*******************************************************************/
const id = agentServiceMock.findOne.id
const uuid = agentServiceMock.findOne.uuid
const username = agentServiceMock.findOne.username
const uuidCondition = { where: { uuid } }
const usernameCondition = { where: { username } }
const connectedCondition = { where: { connected: true } }

const oneAgent = agentServiceMock.findOne
const allAgents = agentServiceMock.findAll
const groupedAgentsByUsername = agentServiceMock.findByUsername
const allConnectedAgents = agentServiceMock.findConnected
const newAgent = {
  id: 1,
  uuid: '4bf322ab-d9f7-4166-a99b-f324203fb7de',
  name: 'neo',
  username: 'matrix',
  hostname: 'ionode',
  pid: 6,
  connected: true,
  createdAt: '2020-02-13',
  updatedAt: '2020-04-20'
}

// jest.mock allow us to make mocks from modules we wanna test.
// So in this case I mock the Agent and Metric models to test
// the initialization of them in the database and the services
// that will be expose from them to make database queries.

// Here all the functions mock for Agent service
const mockAgent = {
  hasMany: jest.fn(),
  findAll: jest.fn((condition) => {
    if (deepEqual(condition, connectedCondition)) {
      return agentServiceMock.findConnected
    }

    if (deepEqual(condition, usernameCondition)) {
      return agentServiceMock.findByUsername
    }

    return agentServiceMock.findAll
  }),
  findByPk: jest.fn(() => agentServiceMock.findById(id)),
  findOne: jest.fn((condition) => {
    if (deepEqual(condition, uuidCondition)) {
      return agentServiceMock.findOne
    }

    return false
  }),
  update: jest.fn(() => agentServiceMock.findOne),
  create: jest.fn(() => ({
    // When create an user the function return created.toJSON
    // so this is the mock implementation for that functionality
    toJSON() {
      return newAgent
    }
  })),
  findByUuid: jest.fn(() => agentServiceMock.findByUuid(uuid)),
  findConnected: jest.fn()
}
jest.mock('../models/agent', () => {
  return jest.fn(() => mockAgent)
})

// Here all mock Metric functions used in the agent tests
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

  afterEach(() => {
    // After each test clear all mocks because one implementation
    // can be used in many test cases so it doesn't accumulate
    // the times had been called
    jest.clearAllMocks()
  })

  test('Agent should be returned', () => {
    expect(db.Agent).toBeTruthy()
  })

  test('AgentModel.hasMany should be called', () => {
    expect(mockAgent.hasMany).toHaveBeenCalled()
  })

  test('AgentModel.hasMany should be called with MetricModel', () => {
    expect(mockAgent.hasMany).toHaveBeenCalledWith(mockMetric)
  })

  test('MetricModel.belongsTo should be called', () => {
    expect(mockMetric.belongsTo).toHaveBeenCalled()
  })

  test('MetricModel.belongsTo should be called with AgentModel', () => {
    expect(mockMetric.belongsTo).toHaveBeenCalledWith(mockAgent)
  })

  test('Agent.findById should be called to return an agent entity', async () => {
    const agent = await db.Agent.findById(id)
    expect(agent).toBe(agentServiceMock.findById(id))
  })

  test('Agent.createOrUpdate should be called to updated an agent', async () => {
    const agent = await db.Agent.createOrUpdate(oneAgent)
    expect(mockAgent.findOne).toHaveBeenCalledTimes(1)
    expect(mockAgent.findOne).toHaveBeenCalledWith(uuidCondition)
    expect(mockAgent.update).toHaveBeenCalledTimes(1)
    expect(mockAgent.update).toHaveBeenCalledWith(oneAgent, uuidCondition)
    expect(agent).toBe(oneAgent)
  })

  test('Agent.createOrUpdate should be called to create an agent', async () => {
    const createdAgent = await db.Agent.createOrUpdate(newAgent)
    expect(mockAgent.findOne).toHaveBeenCalledTimes(1)
    expect(mockAgent.findOne).toHaveBeenCalledWith({
      where: { uuid: newAgent.uuid }
    })
    expect(mockAgent.create).toHaveBeenCalledTimes(1)
    expect(mockAgent.create).toHaveBeenCalledWith(newAgent)
    expect(createdAgent).toBe(newAgent)
  })

  test('Agent.findByUuid should be called an return the matched agent', async () => {
    const agent = await db.Agent.findByUuid(uuid)
    expect(mockAgent.findOne).toHaveBeenCalledTimes(1)
    expect(agent).toBe(oneAgent)
  })

  test('Agent.findAll should be called and return all the agents', async () => {
    const agents = await db.Agent.findAll()
    expect(agents).toBe(allAgents)
  })

  test('Agent.findConnected should return the connected agents', async () => {
    const connectedAgents = await db.Agent.findConnected()
    expect(mockAgent.findAll).toHaveBeenCalledTimes(1)
    expect(mockAgent.findAll).toHaveBeenCalledWith(connectedCondition)
    expect(connectedAgents).toBe(allConnectedAgents)
  })

  test('Agent.findByUsername should return the agents that have the username passed as argument', async () => {
    const agentsByUsername = await db.Agent.findByUsername(username)
    expect(mockAgent.findAll).toHaveBeenCalledTimes(1)
    expect(mockAgent.findAll).toHaveBeenCalledWith(usernameCondition)
    expect(agentsByUsername).toBe(groupedAgentsByUsername)
  })
})
