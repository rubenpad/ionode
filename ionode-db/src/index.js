'use strict'

const defaults = require('defaults')

const databaseService = require('./lib/database')
const agentService = require('./lib/agent')
const metricService = require('./lib/metric')
const agentModel = require('./models/agent')
const metricModel = require('./models/metric')

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

  const sequelize = databaseService(config)
  const AgentModel = agentModel(config)
  const MetricModel = metricModel(config)

  // Test connection to database
  await sequelize.authenticate()

  // Define relations between entities
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Agent = agentService(AgentModel)
  const Metric = metricService(MetricModel, AgentModel)

  return {
    Agent,
    Metric
  }
}

module.exports = setupDatabase
