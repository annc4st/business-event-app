const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = process.env.NODE_ENV === 'production' ? require('../sqlConnection') : require('../connection');


const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
