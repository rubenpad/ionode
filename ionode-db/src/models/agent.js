'use strict'

const Sequelize = require('sequelize')
const databaseService = require('../lib/database')

// Agent model to define the properties that
// has the agent entity in the database
function agentModel(config) {
  const sequelize = databaseService(config)
  const Agent = sequelize.define('agent', {
    uuid: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    hostname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    pid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    connected: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: false
    }
  })

  return Agent
}

module.exports = agentModel
