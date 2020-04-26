export const config = {
  apiUrl: process.env.API_ENDPOINT || 'http://localhost:3001',
  serverHost: process.env.SERVER_HOST || 'http://localhost:3000',
  mqttHost: process.env.MQTT_HOST || 'mqtt://localhost',
  apiToken:
    process.env.API_TOKEN ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTU4NzkwMTgyMn0.3UPW55mig2zBAVkBmqXLNP9u1HAS8CGtyZlOrsFydIE'
}
