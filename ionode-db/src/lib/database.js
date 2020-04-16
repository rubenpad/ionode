'use strict'

const Sequelize = require('sequelize')

let sequelize

function database(config) {
  if (!sequelize) {
    sequelize = new Sequelize(config)
  }

  return sequelize
}

module.exports = database
