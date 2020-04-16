'use strict'

const defaults = require('defaults')

const database = require('./lib/database')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')

async function setupDatabase(config) {
  // Define default values for tests purposes
  // to avoid try to connect PostgreSQL database
  // instead we use sqlite
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = database(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  // Test connection to database
  await sequelize.authenticate()

  // Define relations between entities
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Agent = {}
  const Metric = {}

  return {
    Agent,
    Metric
  }
}

module.exports = setupDatabase
