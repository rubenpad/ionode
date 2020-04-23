'use strict'

// Jest (so far) doesn't provide a way to customize the response
// of a mock according the args with it is called so the solution
// temporary is to test deepEquality between two objects with an
// util function `deepEqual`
const deepEqual = require('../utils/deepEqual')
const mockAgent = require('./mockAgent')

const id = mockAgent.findOne.id
const uuid = mockAgent.findOne.uuid
const username = mockAgent.findOne.username
const uuidCondition = { where: { uuid } }
const usernameCondition = { where: { username } }
const connectedCondition = { where: { connected: true } }
const newAgent = mockAgent.newAgent

const mockAgentService = {
  hasMany: jest.fn(),
  findAll: jest.fn((condition) => {
    if (deepEqual(condition, connectedCondition)) {
      return mockAgent.findConnected
    }

    if (deepEqual(condition, usernameCondition)) {
      return mockAgent.findByUsername
    }

    return mockAgent.findAll
  }),
  findByPk: jest.fn(() => mockAgent.findById(id)),
  findOne: jest.fn((condition) => {
    if (deepEqual(condition, uuidCondition)) {
      return mockAgent.findOne
    }

    return false
  }),
  update: jest.fn(() => mockAgent.findOne),
  create: jest.fn(() => ({
    // When create an user the function return created.toJSON
    // so this is the mock implementation for that functionality
    toJSON() {
      return newAgent
    }
  })),
  findByUuid: jest.fn(() => mockAgent.findByUuid(uuid)),
  findConnected: jest.fn()
}

module.exports = mockAgentService
