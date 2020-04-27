#!/usr/bin/env node

'use strict'

const blessed = require('blessed')
const contrib = require('blessed-contrib')
const moment = require('moment')
const IonodeAgent = require('ionode-agent')

const screen = blessed.screen()
const agent = new IonodeAgent()
const agents = new Map()
const agentMetrics = new Map()
const extended = []
const selected = { uuid: null, type: null }

const grid = new contrib.grid({ rows: 1, cols: 4, screen })
const tree = grid.set(0, 0, 1, 1, contrib.tree, { label: 'Connected Agents' })

console.log(grid, tree)

const lineGraph = grid.set(0, 1, 1, 3, contrib.line, {
  label: 'Metric',
  showLegend: true,
  minY: 0,
  xPadding: 5
})

agent.on('agent/connected', (payload) => {
  const { uuid } = payload.agent

  if (!agents.has(uuid)) {
    agents.set(uuid, payload.agent)
    agentMetrics.set(uuid, {})
  }

  renderData()
})

agent.on('agent/disconnected', (payload) => {
  const { uuid } = payload.agent

  if (agents.has(uuid)) {
    agents.delete(uuid)
    agentMetrics.delete(uuid)
  }

  renderData()
})

agent.on('agent/message', (payload) => {
  const { uuid } = payload.agent
  const { timestamp } = payload

  if (!agents.has(uuid)) {
    agents.set(uuid, payload.agent)
    agentMetrics.set(uuid, {})
  }

  const metrics = agentMetrics.get(uuid)

  payload.metrics.forEach((metric) => {
    const { type, value } = metric

    if (!Array.isArray(metrics[type])) {
      metrics[type] = []
    }

    if (metrics[type].length >= 20) {
      metrics[type].shift()
    }

    metrics[type].push({
      value,
      timestamp: moment(timestamp).format('HH:mm:ss')
    })
  })

  renderData()
})

tree.on('select', (node) => {
  const { uuid } = node

  if (node.agent) {
    node.extended ? extended.push(uuid) : extended.filter((ext) => ext !== uuid)
    selected.uuid = null
    selected.type = null
    return
  }

  selected.uuid = uuid
  selected.type = type

  renderMetric()
})

function renderData() {
  const dataTree = {}

  for (let [uuid, value] of agents) {
    const title = `${value.name} ${value.pid}`
    dataTree[title] = {
      uuid,
      agent: true,
      extended: extended.includes(uuid),
      children: {}
    }

    const metrics = agentMetrics.get(uuid)
    Object.keys(metrics).forEach((type) => {
      const metric = {
        uuid,
        type,
        metric: true
      }

      const metricTitle = `${type} - ${uuid}`
      dataTree[title].children[metricTitle] = metric
    })
  }

  tree.setData({ extended: true, children: dataTree })

  renderMetric()
}

function renderMetric() {
  if (!selected.uuid && !selected.type) {
    lineGraph.setData([{ x: [], y: [], title: '' }])
    screen.render()
    return
  }

  const metrics = agentMetrics.get(selected.uuid)
  const values = metrics[selected.type]
  const series = [
    {
      title: selected.type,
      x: values.map((value) => value.timestamp).slice(-10),
      y: values.map((value) => value.value).slice(-i10)
    }
  ]

  lineGraph.setData(series)
  screen.render()
}

// Options to exit from application
screen.key(['escape', 'q', 'C-c'], (character, key) => {
  process.exit(0)
})

// Focus to allow us interact with the data in the dashboard
tree.focus()
screen.render()
