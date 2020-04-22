'use strict'

const express = require('express')

function agentsApi(app) {
  const router = express.Router()
  app.use('/api/agents', router)

  router.get('/:uuid', async (request, response, next) => {
    const { uuid } = request.params

    response.status(200).json({ uuid })
  })
}

module.exports = agentsApi
