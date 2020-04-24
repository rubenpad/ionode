'use strict'

const net = require('net')
const debug = require('debug')('ionode:mqtt')
const chalk = require('chalk')

const database = require('ionode-db')
const {
  utils: { parsePayload, handleFatalError, handleError },
  config
} = require('ionode-tools')

// Aedes is a barebone MQTT server that can run on any stream servers
// See https://github.com/moscajs/aedes
// redisPersistence to make aedes backend with redis
// https://www.npmjs.com/package/aedes-persistence-redis
const redisPersistence = require('aedes-persistence-redis')
const aedes = require('aedes')({
  persistence: redisPersistence({
    port: 6379,
    host: '127.0.0.1',
    family: 4,
    maxSessionDelivery: 100
  })
})

// This is the database setup
const databaseConfig = {
  ...config.db,
  logging: (msg) => debug(msg)
}

// The server is implemented with core module `net` that expose a createServer method
// The net module provides an asynchronous network API for creating stream-based
// TCP or IPC servers (net.createServer()) and clients (net.createConnection()).
// See https://nodejs.org/api/net.html#net_event_connection
const server = net.createServer(aedes.handle)

// to store the clients connected
const clients = new Map()
let Agent
let Metric

server.listen(1883, (error) => {
  if (!error) {
    console.log(`${chalk.cyan('[ionode-mqtt]:')} server is running`)
  } else {
    handleFatalError(error)
  }
})

server.on('listening', async () => {
  try {
    // Initializes Agent and Metric services
    const services = await database(databaseConfig)
    Agent = services.Agent
    Metric = services.Metric
  } catch (error) {
    handleError(error)
  }
})

aedes.on('client', (client) => {
  debug(`[client-connected]: ${client.id}`)
})

aedes.on('publish', async (packet, client) => {
  debug(`[received]: ${packet.topic}`)

  // if the topic is `agent/message` makes process to save the agent
  // in the database else just log the topic
  if (packet.topic === 'agent/message') {
    debug(`[payload]: ${packet.payload}`)

    // parse the payload to json if that isn't possible return null
    const payload = parsePayload(packet.payload)

    if (payload) {
      let agent

      try {
        agent = await Agent.createOrUpdate({
          // copy the agent and set the property `connected: true`
          ...payload.agent,
          connected: true
        })
        debug(`[saved-agent]: ${agent.id}`)
      } catch (error) {
        handleError(error)
      }

      // if doesn't exist store the agent
      if (!clients.get(client.id)) {
        clients.set(client.id, agent)
        // publish the connected agent
        aedes.publish({
          topic: 'agent/connected',
          payload: JSON.stringify({
            agent: {
              uuid: agent.uuid,
              name: agent.name,
              hostname: agent.hostname,
              pid: agent.pid,
              connected: agent.connected
            }
          })
        })
      }

      // Here the logic to store metrics
      // With map we try to save the metrics parallelly.
      // `map` accepts a sync callback so it returns an array of promises
      // then wait until all the promises are solved and store them into
      // `resolvedPromises` array. At the end log all the ids of each metric
      // saved and it associate agent
      try {
        const promises = payload.metrics.map(async (metric) => {
          const createdMetric = await Metric.create(agent.uuid, metric)
          return createdMetric
        })

        const resolvedPromises = await Promise.all(promises)

        resolvedPromises.forEach((metric) => {
          debug(
            `[saved-metric]: Metric ${metric.id} saved with Agent ${agent.uuid}`
          )
        })
      } catch (error) {
        handleError(error)
      }
    }
  } else {
    debug(`[payload]: ${packet.payload}`)
  }
})

aedes.on('clientDisconnect', async (client) => {
  debug(`[client-disconnected]: ${client.id}`)
  // Try to find the client in the clients connected list
  const agent = clients.get(client.id)

  if (agent) {
    // if client exists update its connected state to false in database
    try {
      await Agent.createOrUpdate({ ...agent, connected: false })
    } catch (error) {
      handleError(error)
    }

    // Delete agent from clients connected list
    clients.delete(client.id)

    aedes.publish({
      topic: 'agent/disconnected',
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    })

    debug(
      `[report]: Client ${client.id} associated to Agent ${agent.uuid} marked as disconnected`
    )
  }
})
