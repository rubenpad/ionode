'use strict'

const Sequelize = require('sequelize')

function setupDatabase (config) {
  let sequelize

  if (!sequelize) {
    sequelize = new Sequelize(config)
  }

  return sequelize
}

module.exports = setupDatabase
