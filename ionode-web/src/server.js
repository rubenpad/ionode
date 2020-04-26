import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import socket from 'socket.io'
import http from 'http'
import proxy from './proxy'
import IonodeAgent from 'ionode-agent'
import pipe from './utils/pipe'
import { config } from './config'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'
const agent = new IonodeAgent({ mqtt: { host: config.mqttHost } })
const app = express()
const server = http.createServer(app)
const io = socket(server)
proxy(app)

app.use(
  compression({ threshold: 0 }),
  sirv('static', { dev }),
  sapper.middleware()
)

server.listen(PORT, (err) => {
  if (err) console.log('error', err)

  agent.connect()
})

io.on('connect', (socket) => {
  console.log(`[connected]: ${socket.id}`)

  // This function makes a pipe to pass the args received in agent emit event
  // to socket emit event and so distribute them
  pipe(agent, socket)
})
