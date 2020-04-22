'use strict'

const express = require('express')

function metricsApi(app) {
  const router = express.Router()
  app.use('/api/metrics', router)

  router.get('/:uuid', async (request, response, next) => {
    const { uuid } = request.params

    response.status(200).json({ uuid })
  })

  router.get('/:uuid/:type', async (request, response, next) => {
    const { uuid, type } = request.params

    response.status(200).json({ uuid, type })
  })
}

module.exports = metricsApi
