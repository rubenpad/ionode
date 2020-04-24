'use strict'

// Fake data to be used in test cases

const agents = [
  {
    id: 1,
    uuid: '4bf322ab-d9f7-4166-a99b-f004203fb7de',
    name: 'tpyett0',
    username: 'ionode',
    hostname: 'ionode',
    pid: 6,
    connected: false,
    createdAt: '2020-03-31',
    updatedAt: '2020-01-08'
  },
  {
    id: 2,
    uuid: '51817372-d9d4-4cdc-89eb-3e5fc3747aec',
    name: 'saspy1',
    username: 'ionode',
    hostname: 'ionode',
    pid: 8,
    connected: true,
    createdAt: '2020-03-26',
    updatedAt: '2019-11-10'
  },
  {
    id: 3,
    uuid: 'd46cc238-5c0d-4372-bf99-1f213dd9c47f',
    name: 'hstroton2',
    username: 'server2',
    hostname: 'ionode-server2',
    pid: 2,
    connected: true,
    createdAt: '2019-07-06',
    updatedAt: '2019-06-18'
  },
  {
    id: 4,
    uuid: '258bdb8c-22d5-4ff0-9722-088376268cc6',
    name: 'bmckeighen3',
    username: 'server2',
    hostname: 'ionode-server2',
    pid: 4,
    connected: false,
    createdAt: '2020-02-12',
    updatedAt: '2019-09-02'
  },
  {
    id: 5,
    uuid: '329c9ff0-ce84-4aea-bd30-c0a441d69406',
    name: 'calvis4',
    username: 'test',
    hostname: 'tests',
    pid: 9,
    connected: false,
    createdAt: '2019-05-06',
    updatedAt: '2019-05-08'
  }
]

const newAgent = {
  id: 1,
  uuid: '4bf322ab-d9f7-4166-a99b-f324203fb7de',
  name: 'neo',
  username: 'matrix',
  hostname: 'ionode',
  pid: 6,
  connected: true,
  createdAt: '2020-02-13',
  updatedAt: '2020-04-20'
}

module.exports = {
  newAgent,
  findOne: agents[0],
  findAll: agents,
  findConnected: agents.filter((agent) => agent.connected),
  findByUsername: (username) =>
    agents.filter((agent) => agent.username === username),
  findByUuid: (uuid) => agents.find((agent) => agent.uuid === uuid),
  findById: (id) => agents.find((agent) => agent.id === id)
}
