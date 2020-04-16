'use strict'

const Sequelize = require('sequelize')
const database = require('../lib/database')

function setupMetricModel(config) {
  const sequelize = database(config)

  const Metric = sequelize.define('metric', {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })

  return Metric
}

module.exports = setupMetricModel
