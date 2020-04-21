'use strict'

const debug = require('debug')('ionode:mqtt')
const chalk = require('chalk')
const redisPersistence = require('aedes-persistence-redis')
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)

server.listen(1383, () => {
  try {
    console.log(chalk.cyan('[ionode-mqtt] server is running...'))
  } catch (error) {
    console.log(chalk.red(`[Error] ${error.message}`))
    console.log(error.stack)
    process.exit(1)
  }
})

aedes.on('client', (client) => {
  debug(`Client connected ${client ? client.id : client}`)
})

aedes.on('clientDisconnect', (client) => {
  debug(`Client disconnected ${client ? client.id : client}`)
})

aedes.on('publish', (packet, client) => {
  debug(`Received: ${packet.topic}`)
  debug(`Payload: ${packet.payload}`)
})
