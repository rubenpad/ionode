'use strict'

const EvenEmitter = require('events')
const os = require('os')
const util = require('util')
const debug = require('debug')('ionode:agent')
const defaults = require('defaults')
const mqtt = require('mqtt')
const uuid = require('uuid')
const {
  utils: { parsePayload }
} = require('ionode-tools')

class IonodeAgent extends EvenEmitter {
  constructor(options) {
    super()
    // Default options used internally if not options were provided
    this._defaultOptions = {
      name: 'unknown',
      username: 'root',
      interval: 5000,
      mqtt: { host: 'mqtt://localhost' }
    }

    this._options = defaults(options, this._defaultOptions)
    this._started = false
    this._timer = null
    this._client = null
    this._agentId = null
    this._metrics = new Map()
  }

  addMetric(type, func) {
    this._metrics.set(type, func)
  }

  deleteMetric(type) {
    this._metrics.delete(type)
  }

  connect() {
    if (!this._started) {
      // Connect the mqtt server and then set the agent started status to true
      this._client = mqtt.connect(this._options.mqtt.host)
      this._started = true

      // Agent will be subscribed to these topics
      this._client.subscribe('agent/connected')
      this._client.subscribe('agent/disconnected')
      this._client.subscribe('agent/message')

      this._client.on('connect', () => {
        // When the client is connected assign an unique uuid to the agent
        this._agentId = uuid.v4()

        // Agent emit the event connected with the uuid created
        this.emit('connected', this._agentId)

        // Emit the message each interval time defined
        this._timer = setInterval(async () => {
          // If there are one or more metrics we build the message to send
          if (this._metrics.size > 0) {
            const message = {
              agent: {
                uuid: this._agentId,
                username: this._options.username,
                name: this._options.name,
                hostname: os.hostname() || this._options.hostname,
                pid: process.pid
              },
              metrics: [],
              timestamp: new Date().getTime()
            }

            // If the handleEvent function provided has a callback
            // the callback is converted into a promise with `util.promisify`
            for (let [metric, func] of this._metrics) {
              if (func.length === 1) {
                func = util.promisify(func)
              }

              // The promise then is resolve to send the message
              message.metrics.push({
                type: metric,
                value: await Promise.resolve(func())
              })
            }

            debug(`[agent-sending]: ${message}`)

            // Use the client instance to publish the message
            this._client.publish('agent/message', JSON.stringify(message))
            this.emit('message', message)
          }
        }, this._options.interval)
      })

      this._client.on('message', (topic, payload) => {
        // If the topic is some of these parsed the payload and emit according the topic
        if (
          topic === 'agent/connected' ||
          topic === 'agent/disconnected' ||
          topic === 'agent/message'
        ) {
          const parsedPayload = parsePayload(payload)
          const { agent } = parsedPayload
          const shouldBroadcast =
            parsedPayload && agent && agent.uuid !== this._agentId

          if (shouldBroadcast) {
            this.emit(topic, parsedPayload)
          }
        }
      })

      this._client.on('error', () => this.disconnect())
    }
  }

  disconnect() {
    // Handle the disconnection event
    if (this._started) {
      clearInterval(this._timer)
      this._started = false
      this.emit('disconnected', this._agentId)
      this._client.end()
    }
  }
}

module.exports = IonodeAgent
