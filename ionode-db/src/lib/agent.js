'use strict'

function agentService(AgentModel) {
  function findById(id) {
    // v5 sequelize `findById` was replaced by `findByPk`
    return AgentModel.findByPk(id)
  }

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

  return {
    findById,
    createOrUpdate
  }
}

module.exports = agentService
