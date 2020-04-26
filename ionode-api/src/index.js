'use strict'

const express = require('express')
const cors = require('cors')
const chalk = require('chalk')
const { config } = require('ionode-tools')

const servicesApi = require('./routes')

// Error middleware
const {
  logErrors,
  wrapErrors,
  errorHandler
} = require('./utils/middleware/errorHandlers')
const notFoundHandler = require('./utils/middleware/notFoundHandler')

// Initialize the app
const app = express()

// CORS
app.use(cors())
app.options('*', cors())

// body parser
app.use(express.json())

// routes
servicesApi(app)

// catch a 404 error
app.use(notFoundHandler)

// catch errors
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)

app.listen(config.apiPort, () => {
  console.log(
    `${chalk.green('[ionode-api]:')} server listening at http://localhost:${
      config.apiPort
    }`
  )
})
