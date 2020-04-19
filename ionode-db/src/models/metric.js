'use strict'

const Sequelize = require('sequelize')
const databaseService = require('../lib/database')

// Metric model to define the properties that
// has the metric entity in the database
function metricModel(config) {
  const sequelize = databaseService(config)

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

module.exports = metricModel
