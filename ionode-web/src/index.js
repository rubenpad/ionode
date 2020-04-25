'use strict'

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const chalk = require('chalk')
const debug = require('debug')('ionode:client')
const IonodeAgent = require('ionode-agent')
const { config } = require('ionode-tools')
const pipe = require('./utils/pipe')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const agent = new IonodeAgent()

// Expose the static files in public folder
app.use(express.static(path.join(__dirname, 'public')))

io.on('connect', (socket) => {
  debug(`[connected]: ${socket.id}`)

  // This function makes a pipe to pass the args received in agent emit event
  // to socket emit event and so distribute them
  pipe(agent, socket)
})

server.listen(config.clientPort, () => {
  console.log(
    `${chalk.green('[ionode-client]:')} server listening on http://localhost:${
      config.clientPort
    }`
  )

  // After the server is running fire the connect agent event
  agent.connect()
})
