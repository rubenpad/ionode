'use strict'

const debug = require('debug')('app:database')
const inquirer = require('inquirer')
const chalk = require('chalk')

const database = require('./index')
const { dbDialect, dbHost, dbName, dbUser, dbPassword } = require('./config')
const handleFatalError = require('./utils/handleFatalError')

async function setup() {
  const prompt = inquirer.createPromptModule()
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy the database, are you sure?'
    }
  ])

  if (!answer.setup) {
    console.log(chalk.cyan('Nothing done!'))
    return
  }

  const config = {
    host: dbHost,
    database: dbName,
    username: dbUser,
    password: dbPassword,
    dialect: dbDialect,
    logging: (msg) => debug(msg),
    setup: true
  }

  // Try to initialize the database if something get wrong
  // the error will be handle with handleFatalError function
  try {
    await database(config)

    console.log(chalk.green('Success!'))
    process.exit(0)
  } catch (error) {
    handleFatalError(error)
  }
}

setup()
