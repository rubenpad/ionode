'use strict'

require('dotenv').config()

const config = {
  port: process.env.PORT || 3000,
  dbDialect: process.env.DB_DIALECT,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD
}

module.exports = config
