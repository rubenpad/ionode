'use strict'

// Metric services exposed to make queries to the database
function metricService(MetricModel, AgentModel) {
  /**
   *
   * @param {string} agentUuid To search the agent and associate to it
   * the metric will be created
   * @param {object} metric Has the data to create the metric
   */
  async function create(agentUuid, metric) {
    const agent = await AgentModel.findOne({ where: { uuid: agentUuid } })

    if (agent) {
      const result = await MetricModel.create({ ...metric, agentId: agent.id })
      return result.toJSON()
    }
  }

  /**
   *
   * @param {string} agentUuid To search all the metrics associated with
   * the agent that has the uuid passed as argument
   */
  async function findByAgentUuid(agentUuid) {
    const metricsByAgentUuid = await MetricModel.findAll({
      attributes: ['type'],
      group: ['type'],
      include: [
        {
          attributes: [],
          model: AgentModel,
          where: {
            uuid: agentUuid
          }
        }
      ],
      raw: true
    })

    return metricsByAgentUuid
  }

  /**
   *
   * @param {string} metricType To search metrics by type
   * @param {string} agentUuid To search the metrics owned by the agent
   * with this uuid
   */
  async function findByTypeAgentUuid(metricType, agentUuid) {
    const metricsByTypeAgentUuid = await MetricModel.findAll({
      attributes: ['id', 'type', 'value', 'createdAt'],
      where: {
        type: metricType
      },
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: [
        {
          attributes: [],
          model: AgentModel,
          where: {
            uuid: agentUuid
          }
        }
      ],
      raw: true
    })

    return metricsByTypeAgentUuid
  }

  return {
    create,
    findByAgentUuid,
    findByTypeAgentUuid
  }
}

module.exports = metricService
