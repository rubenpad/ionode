import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'

import http from 'http'
import proxy from './proxy'
const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const app = express()
proxy(app)
const server = http.createServer(app)

app.use(
  compression({ threshold: 0 }),
  sirv('static', { dev }),
  sapper.middleware()
)

server.listen(PORT, (err) => {
  if (err) console.log('error', err)
})
