# Database module for ionode project

## Usage

```js
const setupDatabase = require('database')

setupDatabase(config)
  .then(db => ({ Agent, Metric }))
  .catch(error => console.log(error));

```