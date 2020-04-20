# IoNode - IoT Platform

IoNode is an IoT platform developed in the Node Advance Course at Platzi. In this project we developed several modules and connect them to monitor processes and store the metrics in a relational database.

#### Tech stack

- Node
- PostgreSQL
- Redis
- Mosca as MQTT broker - changing to Aedes because mosca is unmaintained
- Jest

Initially unit tests were implemented using Ava as test runner and sinon to make mocks and stubs. In this project I made some changes like only use Jest to make unit testing. With Jest you can generate the test cases and mock modules functionalities.

Other change implemented is Mosca by Aedes because mosca is right now an unmaintained project.

_Please see modules folder to information detailed about each_

So here we go!