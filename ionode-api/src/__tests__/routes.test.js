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

const testServer = require('../utils/testServer')
const route = require('../routes')

describe('routes api tests', () => {
  let request = null
  const uuid = mockAgent.findOne.uuid
  const type = mockMetric.findOne.type

  beforeEach(() => {
    request = testServer(route)
  })

  test('GET /api/agents should returns a 200 status code', async () => {
    await request.get('/api/agents').expect('Content-Type', /json/).expect(200)
  })

  test('GET /api/agents should returns all agents connected', async () => {
    const response = await request.get('/api/agents')
    const expected = await mockAgentService.findConnected()
    const data = response.body.data

    expect(data).toEqual(expected)
  })

  test('GET /api/agents/:uuid should returns the agent with uuid matched', async () => {
    const response = await request.get(`/api/agents/${uuid}`)
    const expected = await mockAgentService.findByUuid(uuid)
    const data = response.body.data

    expect(data).toEqual(expected)
  })

  test('GET /api/metrics/:uuid should returns a 200 status code and the metrics with agent uuid matched', async () => {
    const response = await request.get(`/api/metrics/${uuid}`)
    const expected = await mockMetricService.findByAgentUuid(uuid)
    const code = response.statusCode
    const data = response.body.data

    expect(code).toEqual(200)
    expect(data).toEqual(expected)
  })

  test('GET /api/metrics/:uuid/:type should return a 200 status code and metrics with agent uuid and metric type matched', async () => {
    const response = await request.get(`/api/metrics/${uuid}/${type}`)
    const expected = await mockMetricService.findByTypeAgentUuid(type, uuid)
    const code = response.statusCode
    const data = response.body.data

    expect(code).toEqual(200)
    expect(data).toEqual(expected)
  })
})
