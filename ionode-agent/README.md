## ionode-agent
Usage

```js
const IonodeAgent = require('ionode-agent')

const agent = new IonodeAgent({
  name: 'Anderson',
  username: 'neo',
  interval: 2000
})

agent.addMetric('rss', function getRss () {
  return process.memoryUsage().rss
})

agent.addMetric('promiseMetric', function getRandomPromise () {
  return Promise.resolve(Math.random())
})

agent.addMetric('callbackMetric', function getRandomCallback (callback) {
  setTimeout(() => {
    callback(null, Math.random())
  }, 1000)
})

agent.connect()

// These are the methods exposed by this agent instance
agent.on('connected', eventHandler)
agent.on('disconnected', eventHandler)
agent.on('message', eventHandler)

// These methods are for other agents
agent.on('agent/connected', eventHandler)
agent.on('agent/disconnected', eventHandler)
agent.on('agent/message', eventHandler)

function eventHandler (payload) {
  console.log(payload)
}

// disconnect the agent after 20000ms
setTimeout(() => agent.disconnect(), 20000)

```