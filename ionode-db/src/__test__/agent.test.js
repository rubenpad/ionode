'use strict'

// Tell to jest when agent and metric are required in `index.js`
// use the mock from them. jest.mock() takes a moduleFactory
// argument as a second argument that returns the mock and with it
// we can specify what mock to use.
const mockAgent = require('../__mocks__/mockAgent')
const mockAgentService = require('../__mocks__/mockAgentService')
jest.mock('../models/agent', () => jest.fn(() => mockAgentService))

const mockMetricService = require('../__mocks__/mockMetricService')
jest.mock('../models/metric', () => jest.fn(() => mockMetricService))

const setupDatabase = require('../')

// Data to be used in test cases
const id = mockAgent.findOne.id
const uuid = mockAgent.findOne.uuid
const username = mockAgent.findOne.username
const uuidCondition = { where: { uuid } }
const usernameCondition = { where: { username } }
const connectedCondition = { where: { connected: true } }

const oneAgent = mockAgent.findOne
const allAgents = mockAgent.findAll
const groupedAgentsByUsername = mockAgent.findByUsername
const allConnectedAgents = mockAgent.findConnected
const newAgent = mockAgent.newAgent

// Test suite
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
    expect(mockAgentService.hasMany).toHaveBeenCalled()
  })

  test('AgentModel.hasMany should be called with MetricModel', () => {
    expect(mockAgentService.hasMany).toHaveBeenCalledWith(mockMetricService)
  })

  test('Agent.findById should be called to return an agent entity', async () => {
    const agent = await db.Agent.findById(id)
    expect(agent).toBe(mockAgent.findById(id))
  })

  test('Agent.createOrUpdate should be called to updated an agent', async () => {
    const agent = await db.Agent.createOrUpdate(oneAgent)
    expect(mockAgentService.findOne).toHaveBeenCalledTimes(2)
    expect(mockAgentService.findOne).toHaveBeenCalledWith(uuidCondition)
    expect(mockAgentService.update).toHaveBeenCalledTimes(1)
    expect(mockAgentService.update).toHaveBeenCalledWith(
      oneAgent,
      uuidCondition
    )
    expect(agent).toBe(oneAgent)
  })

  test('Agent.createOrUpdate should be called to create an agent', async () => {
    const createdAgent = await db.Agent.createOrUpdate(newAgent)
    expect(mockAgentService.findOne).toHaveBeenCalledTimes(1)
    expect(mockAgentService.findOne).toHaveBeenCalledWith({
      where: { uuid: newAgent.uuid }
    })
    expect(mockAgentService.create).toHaveBeenCalledTimes(1)
    expect(mockAgentService.create).toHaveBeenCalledWith(newAgent)
    expect(createdAgent).toBe(newAgent)
  })

  test('Agent.findByUuid should be called an return the matched agent', async () => {
    const agent = await db.Agent.findByUuid(uuid)
    expect(mockAgentService.findOne).toHaveBeenCalledTimes(1)
    expect(agent).toBe(oneAgent)
  })

  test('Agent.findAll should be called and return all the agents', async () => {
    const agents = await db.Agent.findAll()
    expect(agents).toBe(allAgents)
  })

  test('Agent.findConnected should return the connected agents', async () => {
    const connectedAgents = await db.Agent.findConnected()
    expect(mockAgentService.findAll).toHaveBeenCalledTimes(1)
    expect(mockAgentService.findAll).toHaveBeenCalledWith(connectedCondition)
    expect(connectedAgents).toBe(allConnectedAgents)
  })

  test('Agent.findByUsername should return the agents that have the username passed as argument', async () => {
    const agentsByUsername = await db.Agent.findByUsername(username)
    expect(mockAgentService.findAll).toHaveBeenCalledTimes(1)
    expect(mockAgentService.findAll).toHaveBeenCalledWith(usernameCondition)
    expect(agentsByUsername).toBe(groupedAgentsByUsername)
  })
})
