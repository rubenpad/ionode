'use strict'

// Jest (so far) doesn't provide a way to customize the response
// of a mock according the args with it is called so the solution
// temporary is to test deepEquality between two objects with an
// util function `deepEqual`
const { deepEqual } = require('../../utils/deepEqual')
const agentServiceMock = require('../../__mocks__/lib/agentServiceMock')

const id = agentServiceMock.findOne.id
const uuid = agentServiceMock.findOne.uuid
const username = agentServiceMock.findOne.username
const uuidCondition = { where: { uuid } }
const usernameCondition = { where: { username } }
const connectedCondition = { where: { connected: true } }
const newAgent = agentServiceMock.newAgent

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

module.exports = mockAgent
