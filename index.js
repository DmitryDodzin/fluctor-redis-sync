
const package = require('./package.json');

const METADATA = {
  NAME: 'redis',
  VERSION: package.version,
  API_VERSION: 1
};

const Client = require('./lib/client');

module.exports = {
  METADATA,
  Client,
  create: options => new Promise(
    (resolve, reject) => {
      let client = new Client(options);
      client.on('ready', () => resolve(client));  
      client.on('error', err => reject(err));  
    }
  )
};