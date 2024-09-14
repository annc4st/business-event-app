const devData = require('../data/development-data/index.js');
const seed = process.env.NODE_ENV === 'production'
 ? require('./seed-prod.js') : require('./seed.js');
const db = process.env.NODE_ENV === 'production' ? require('../sqlConnection') : require('../connection');


// const runSeed = () => {
//   return seed(devData).then(() => db.end());
// };

const runSeed = () => {
  return seed(devData)
    .then(() => db.end())
    .catch((err) => {
      console.error(`Error seeding ${process.env.NODE_ENV} database:`, err);
    });
};


runSeed();
