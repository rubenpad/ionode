'use strict'

import express from 'express'
import fetch from 'node-fetch'
import { config } from './config/index.js'

function proxy(app) {
  const router = express.Router()
  app.use('', router)

  router.get('/agents', async (request, response, next) => {
    try {
      const resp = await fetch(`${config.apiUrl}/api/agents`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.apiToken}`
        }
      })

      const { data } = await resp.json()

      response.send(data)
    } catch (error) {
      return next(new Error('Service not available. Try again'))
    }
  })

  router.get('/agents/:uuid', async (request, response, next) => {
    const { uuid } = request.params

    try {
      const resp = await fetch(`${config.apiUrl}/api/agents/${uuid}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.apiToken}`
        }
      })

      const { data } = await resp.json()
      response.send(data)
    } catch (error) {
      return next(new Error('Service not available. Try again'))
    }
  })

  router.get('/metrics/:uuid', async (request, response, next) => {
    const { uuid } = request.params

    try {
      const resp = await fetch(`${config.apiUrl}/api/metrics/${uuid}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.apiToken}`
        }
      })

      const { data } = await resp.json()
      response.send(data)
    } catch (error) {
      return next(new Error('Service not available. Try again'))
    }
  })

  router.get('/metrics/:uuid/:type', async (request, response, next) => {
    const { uuid, type } = request.params

    try {
      const resp = await fetch(`${config.apiUrl}/api/metrics/${uuid}/${type}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.apiToken}`
        }
      })

      const { data } = await resp.json()
      response.send(data)
    } catch (error) {
      return next(new Error('Service not available. Try again'))
    }
  })
}

export default proxy
