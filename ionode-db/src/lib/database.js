'use strict'

const Sequelize = require('sequelize')

let sequelize

function databaseService(config) {
  if (!sequelize) {
    sequelize = new Sequelize(config)
  }

  return sequelize
}

module.exports = databaseService
