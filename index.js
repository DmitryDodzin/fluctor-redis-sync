
const package = require('./package.json');

const METADATA = {
  NAME: 'redis',
  VERSION: package.version,
  API_VERSION: 1
};

const Client = require('./lib/client');

module.exports = {
  METADATA,
  Client
};