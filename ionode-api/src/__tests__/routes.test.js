'use strict'

const mockAgent = require('../__mocks__/mockAgent')
const mockMetric = require('../__mocks__/mockMetric')
const mockAgentService = require('../__mocks__/mockAgentService')
const mockMetricService = require('../__mocks__/mockMetricService')
jest.mock('ionode-db', () =>
  jest.fn().mockResolvedValue({
    Agent: mockAgentService,
    Metric: mockMetricService
  })
)

const jwt = require('jsonwebtoken')
const testServer = require('../utils/testServer')
const route = require('../routes')
const { config } = require('ionode-tools')

describe('routes api tests', () => {
  let request = null
  let token = null
  const uuid = mockAgent.findOne.uuid
  const type = mockMetric.findOne.type

  beforeEach(() => {
    request = testServer(route)
    token = jwt.sign({ username: 'ionode', admin: true }, config.auth.secret)
  })

  test('GET /api/agents should returns a 200 status code', async () => {
    await request
      .get('/api/agents')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
  })

  test('GET /api/agents should returns all agents connected', async () => {
    const response = await request
      .get('/api/agents')
      .set('Authorization', `Bearer ${token}`)
    const expected = await mockAgentService.findConnected()
    const data = response.body.data

    expect(data).toEqual(expected)
  })

  test('GET /api/agents/:uuid should returns the agent with uuid matched', async () => {
    const response = await request
      .get(`/api/agents/${uuid}`)
      .set('Authorization', `Bearer ${token}`)
    const expected = await mockAgentService.findByUuid(uuid)
    const data = response.body.data

    expect(data).toEqual(expected)
  })

  test('GET /api/metrics/:uuid should returns a 200 status code and the metrics with agent uuid matched', async () => {
    const response = await request
      .get(`/api/metrics/${uuid}`)
      .set('Authorization', `Bearer ${token}`)
    const expected = await mockMetricService.findByAgentUuid(uuid)
    const code = response.statusCode
    const data = response.body.data

    expect(code).toEqual(200)
    expect(data).toEqual(expected)
  })

  test('GET /api/metrics/:uuid/:type should return a 200 status code and metrics with agent uuid and metric type matched', async () => {
    const response = await request
      .get(`/api/metrics/${uuid}/${type}`)
      .set('Authorization', `Bearer ${token}`)
    const expected = await mockMetricService.findByTypeAgentUuid(type, uuid)
    const code = response.statusCode
    const data = response.body.data

    expect(code).toEqual(200)
    expect(data).toEqual(expected)
  })
})
