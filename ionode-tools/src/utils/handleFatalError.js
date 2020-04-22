'use strict'

const chalk = require('chalk')

function handleFatalError(error) {
  console.error(chalk.red(`[fatal-error]: ${error.message}`))
  console.error(error.stack)
  process.exit(1)
}

module.exports = handleFatalError
