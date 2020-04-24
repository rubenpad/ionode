'use strict'

// Jest (so far) doesn't provide a way to customize the response
// of a mock according the args with it is called so the solution
// temporary is to test deepEquality between two objects with an
// util function `deepEqual`
const {
  utils: { deepEqual }
} = require('ionode-tools')
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
      return Promise.resolve(mockAgent.findConnected)
    }

    if (deepEqual(condition, usernameCondition)) {
      return Promise.resolve(mockAgent.findByUsername)
    }

    return mockAgent.findAll
  }),
  findByPk: jest.fn(() => Promise.resolve(mockAgent.findById(id))),
  findOne: jest.fn((condition) => {
    if (deepEqual(condition, uuidCondition)) {
      return Promise.resolve(mockAgent.findOne)
    }

    // false if no one was found
    return Promise.resolve(false)
  }),
  update: jest.fn(() => Promise.resolve(mockAgent.findOne)),
  create: jest.fn(() =>
    Promise.resolve({
      // When create an user the function return created.toJSON
      // so this is the mock implementation for that functionality
      toJSON() {
        return newAgent
      }
    })
  ),
  findByUuid: jest.fn(() => Promise.resolve(mockAgent.findByUuid(uuid))),
  findConnected: jest.fn(() => Promise.resolve(mockAgent.findConnected))
}

module.exports = mockAgentService
