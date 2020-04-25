'use strict'

function parsePayload(payload) {
  let parsedPayload

  if (payload instanceof Buffer) {
    parsedPayload = payload.toString()
  }

  try {
    parsedPayload = JSON.parse(parsedPayload)
  } catch (error) {
    parsedPayload = null
  }

  return parsedPayload
}

module.exports = parsePayload
