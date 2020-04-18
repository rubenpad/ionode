'use strict'

function agentService(AgentModel) {
  async function createOrUpdate(agent) {
    const condition = { where: { uuid: agent.uuid } }
    const agentExists = AgentModel.findOne(condition)

    if (agentExists) {
      const updated = await AgentModel.update(agent, condition)
      return updated || agentExists
    }

    const created = await AgentModel.create(agent)
    return created.toJSON()
  }

  async function findAll() {
    const agents = await AgentModel.findAll()
    return agents
  }

  async function findById(id) {
    // v5 sequelize `findById` was replaced by `findByPk`
    const agent = await AgentModel.findByPk(id)
    return agent
  }

  async function findByUuid(uuid) {
    const agent = await AgentModel.findOne({ where: { uuid } })
    return agent
  }

  async function findConnected() {
    const connectedAgents = await AgentModel.findAll({
      where: { connected: true }
    })
    return connectedAgents
  }

  async function findByUsername(username) {
    const groupedAgentsByUsername = await AgentModel.findAll({
      where: { username }
    })
    return groupedAgentsByUsername
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    findByUuid,
    findConnected,
    findByUsername
  }
}

module.exports = agentService
