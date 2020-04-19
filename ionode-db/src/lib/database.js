'use strict'

const Sequelize = require('sequelize')

let sequelize

// Singleton pattern to provide a unique
// connection instance to the database
function databaseService(config) {
  if (!sequelize) {
    sequelize = new Sequelize(config)
  }

  return sequelize
}

module.exports = databaseService
