'use strict'

const chalk = require('chalk')

function handleError(error) {
  console.error(`${chalk.red('[error]:')} ${error.message}`)
  console.error(error.stack)
}

module.exports = handleError
