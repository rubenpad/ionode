# Database module for ionode project

## Usage

```js
const setupDatabase = require('database')

setupDatabase(config)
  .then(db => ({ Agent, Metric }))
  .catch(error => console.log(error));

```

## Tests

Tests are implemented with [Jest](jestjs.io).
The tests suites are stored in the __test__ folder and mocks used
in test cases in the __mocks__ folder.

### Run tests

`npm run test`

### Test coverage

`npm run test:coverage`