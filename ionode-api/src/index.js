'use strict'

const express = require('express')
const chalk = require('chalk')
const { config, handleFatalError } = require('ionode-tools')

const agentsApi = require('./routes/agents')
const metricsApi = require('./routes/metrics')

const app = express()

// body parser
app.use(express.json())

// routes
agentsApi(app)
metricsApi(app)

app.listen(config.port, (error) => {
  if (!error) {
    console.log(
      `${chalk.green('[ionode-api]:')} server listening at http://localhost:${
        config.port
      }`
    )
  } else {
    handleFatalError(error)
  }
})
