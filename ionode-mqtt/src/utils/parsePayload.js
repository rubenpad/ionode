'use strict'

function parsePayload(payload) {
  let parsedPayload

  if (payload instanceof Buffer) {
    parsedPayload = payload.toString('utf-8')
  }

  try {
    parsedPayload = JSON.parse(parsedPayload)
  } catch (error) {
    parsedPayload = null
  }

  return parsedPayload
}

module.exports = { parsePayload }
