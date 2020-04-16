'use strict'

const Sequelize = require('sequelize')
const database = require('../lib/database')

function setupAgentModel(config) {
  const sequelize = database(config)
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

module.exports = setupAgentModel
