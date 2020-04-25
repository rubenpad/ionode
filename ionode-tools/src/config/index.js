'use strict'

require('dotenv').config()

const config = {
  dev: process.env.NODE_ENV !== 'production',
  apiPort: process.env.API_PORT || 3000,
  clientPort: process.env.CLIENT_PORT || 8080,
  auth: {
    secret: process.env.SECRET
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT
  }
}

module.exports = config
