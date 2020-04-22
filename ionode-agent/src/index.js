'use strict'

const EvenEmitter = require('events')
const debug = require('debug')
const mqtt = require('mqtt')
const uuid = require('uuid')

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
    this._options = options || this._defaultOptions
    this._started = false
    this._timer = null
    this._client = null
    this._agentId = null
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
        this._timer = setInterval(() => {
          this.emit('agent/message', 'this is a message')
        }, this._options.interval)
      })

      this._client.on('message', (topic, payload) => {
        // If the topic is some of these parsed the payload and emit according the topic
        if (
          topic === 'agent/connected' ||
          topic === 'agent/disconnected' ||
          topic === 'agent/message'
        ) {
          const parsedPayload = parsedPayload(payload)
          const { agent } = parsedPayload
          const shouldBroadcast =
            parsedPayload && agent && agent.uuid !== this._agentId

          if (shouldBroadcast) {
            this.emit(topic, payload)
          }
        }
      })

      this._client.on('error', () => this.disconnect())
    }
  }

  disconnect() {
    if (this._started) {
      clearInterval(this._timer)
      this._started = false
      this.emit('disconnected')
    }
  }
}

module.exports = IonodeAgent
