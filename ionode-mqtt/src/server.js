'use strict'

const debug = require('debug')('ionode:mqtt')
const chalk = require('chalk')
const net = require('net')
const redisPersistence = require('aedes-persistence-redis')
const aedes = require('aedes')({
  persistence: redisPersistence({
    port: 6379,
    host: '127.0.0.1',
    family: 4,
    maxSessionDelivery: 100
  })
})

const server = net.createServer(aedes.handle)

server.listen(1883, () => {
  console.log('Server listening')
})

aedes.on('client', (client) => {
  debug(`[client-connected]: ${client.id}`)
})

aedes.on('clientDisconnect', (client) => {
  debug(`[client-disconnected]: ${client.id}`)
})

aedes.on('publish', (packet, client) => {
  debug(`[received]: ${packet.topic}`)
  debug(`[received]: ${packet.payload}`)
})
