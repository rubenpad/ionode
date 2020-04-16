'use strict'

const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('Agent tests', () => {
  let db = null
  const config = { logging: jest.fn() }

  beforeEach(async () => {
    const setupDatabase = require('..')

    db = await setupDatabase(config)
  })

  test('Should exists the Agent service', async () => {
    expect(db.Agent).toBeTruthy()
  })
})
