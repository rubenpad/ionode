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
const agentServiceMock = require('../utils/mocks/agentServiceMock')

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
const newAgent = agentServiceMock.newAgent

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
