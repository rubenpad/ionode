'use strict'

// Agent service expose to make queries to the database
function agentService(AgentModel) {
  /**
   *
   * @param {object} agent Data to be crated or updated in the database
   */
  async function createOrUpdate(agent) {
    const condition = { where: { uuid: agent.uuid } }
    const agentExists = await AgentModel.findOne(condition)

    if (agentExists) {
      const updated = await AgentModel.update(agent, condition)
      return updated ? await AgentModel.findOne(condition) : agentExists
    }

    const created = await AgentModel.create(agent)
    return created.toJSON()
  }

  /**
   * Find all the agents stored in the database
   */
  async function findAll() {
    const agents = await AgentModel.findAll()
    return agents
  }

  // Find an agent by id
  async function findById(id) {
    // v5 sequelize `findById` was replaced by `findByPk`
    const agent = await AgentModel.findByPk(id)
    return agent
  }

  // Find an agent by uuid
  async function findByUuid(uuid) {
    const agent = await AgentModel.findOne({ where: { uuid } })
    return agent
  }

  // Find all the agents with connected: true
  async function findConnected() {
    const connectedAgents = await AgentModel.findAll({
      where: { connected: true }
    })
    return connectedAgents
  }

  // Find all the agents that have the same username
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
