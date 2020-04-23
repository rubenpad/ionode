'use strict'

// Tell to jest when agent and metric are required in `index.js`
// use the mock from them. jest.mock() takes a moduleFactory
// argument as a second argument that returns the mock and with it
// we can specify what mock to use.
const { mocks } = require('ionode-tools')
jest.mock('../models/agent', () => jest.fn(() => mocks.mockAgentService))
jest.mock('../models/metric', () => jest.fn(() => mocks.mockMetricService))

const setupDatabase = require('../')

// Data to be used in test cases
const id = mocks.mockAgent.findOne.id
const uuid = mocks.mockAgent.findOne.uuid
const username = mocks.mockAgent.findOne.username
const uuidCondition = { where: { uuid } }
const usernameCondition = { where: { username } }
const connectedCondition = { where: { connected: true } }

const oneAgent = mocks.mockAgent.findOne
const allAgents = mocks.mockAgent.findAll
const groupedAgentsByUsername = mocks.mockAgent.findByUsername
const allConnectedAgents = mocks.mockAgent.findConnected
const newAgent = mocks.mockAgent.newAgent

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
    expect(mocks.mockAgentService.hasMany).toHaveBeenCalled()
  })

  test('AgentModel.hasMany should be called with MetricModel', () => {
    expect(mocks.mockAgentService.hasMany).toHaveBeenCalledWith(
      mocks.mockMetricService
    )
  })

  test('Agent.findById should be called to return an agent entity', async () => {
    const agent = await db.Agent.findById(id)
    expect(agent).toBe(mocks.mockAgent.findById(id))
  })

  test('Agent.createOrUpdate should be called to updated an agent', async () => {
    const agent = await db.Agent.createOrUpdate(oneAgent)
    expect(mocks.mockAgentService.findOne).toHaveBeenCalledTimes(2)
    expect(mocks.mockAgentService.findOne).toHaveBeenCalledWith(uuidCondition)
    expect(mocks.mockAgentService.update).toHaveBeenCalledTimes(1)
    expect(mocks.mockAgentService.update).toHaveBeenCalledWith(
      oneAgent,
      uuidCondition
    )
    expect(agent).toBe(oneAgent)
  })

  test('Agent.createOrUpdate should be called to create an agent', async () => {
    const createdAgent = await db.Agent.createOrUpdate(newAgent)
    expect(mocks.mockAgentService.findOne).toHaveBeenCalledTimes(1)
    expect(mocks.mockAgentService.findOne).toHaveBeenCalledWith({
      where: { uuid: newAgent.uuid }
    })
    expect(mocks.mockAgentService.create).toHaveBeenCalledTimes(1)
    expect(mocks.mockAgentService.create).toHaveBeenCalledWith(newAgent)
    expect(createdAgent).toBe(newAgent)
  })

  test('Agent.findByUuid should be called an return the matched agent', async () => {
    const agent = await db.Agent.findByUuid(uuid)
    expect(mocks.mockAgentService.findOne).toHaveBeenCalledTimes(1)
    expect(agent).toBe(oneAgent)
  })

  test('Agent.findAll should be called and return all the agents', async () => {
    const agents = await db.Agent.findAll()
    expect(agents).toBe(allAgents)
  })

  test('Agent.findConnected should return the connected agents', async () => {
    const connectedAgents = await db.Agent.findConnected()
    expect(mocks.mockAgentService.findAll).toHaveBeenCalledTimes(1)
    expect(mocks.mockAgentService.findAll).toHaveBeenCalledWith(
      connectedCondition
    )
    expect(connectedAgents).toBe(allConnectedAgents)
  })

  test('Agent.findByUsername should return the agents that have the username passed as argument', async () => {
    const agentsByUsername = await db.Agent.findByUsername(username)
    expect(mocks.mockAgentService.findAll).toHaveBeenCalledTimes(1)
    expect(mocks.mockAgentService.findAll).toHaveBeenCalledWith(
      usernameCondition
    )
    expect(agentsByUsername).toBe(groupedAgentsByUsername)
  })
})
