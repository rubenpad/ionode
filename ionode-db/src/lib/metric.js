'use strict'

function metricService(AgentModel, MetricModel) {
  async function create(agentUuid, metric) {
    const agent = AgentModel.findOne({ where: { uuid: agentUuid } })

    if (agent) {
      const result = MetricModel.create({ ...metric, agentId: agent.id })
      return result.toJSON()
    }
  }

  return {
    create
  }
}

module.exports = metricService
