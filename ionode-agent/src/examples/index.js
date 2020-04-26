'use strict'

const IonodeAgent = require('../')

const agent = new IonodeAgent({
  name: 'node',
  username: 'ionode',
  interval: 2000
})

agent.addMetric('rss', function getRss() {
  return process.memoryUsage().rss
})

agent.addMetric('promiseMetric', function getRandomPromise() {
  return Promise.resolve(Math.random())
})

agent.addMetric('callbackMetric', function getRandomCallback(callback) {
  setTimeout(() => {
    callback(null, Math.random())
  }, 1000)
})

agent.connect()

// These are the methods expose by this agent instance
agent.on('connected', eventHandler)
agent.on('disconnected', eventHandler)
agent.on('message', eventHandler)

// This methods are for other agents
agent.on('agent/connected', eventHandler)
agent.on('agent/disconnected', eventHandler)
agent.on('agent/message', eventHandler)

// eventHandler function to be execute in each event
function eventHandler(payload) {
  console.log(payload)
}

setTimeout(() => agent.disconnect(), 60000)
