
const TRANSACTION_CHANNEL = 'state:change';

const SNAPSHOT_CHANNEL = 'state:rewrite';

module.exports = { 
  [TRANSACTION_CHANNEL]: 'transaction',
  [SNAPSHOT_CHANNEL]: 'snapshot'
};