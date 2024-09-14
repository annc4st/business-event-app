const devData = require('../data/development-data/index.js');
const seed = process.env.NODE_ENV === 'production' ? require('./seed-prod.js') : require('./seed.js');
const db = process.env.NODE_ENV === 'production' ? require('../sqlConnection') : require('../connection');


// const runSeed = () => {
//   return seed(devData).then(() => db.end());
// };


const runSeed = async () => {
  try {
    // Run the seed process with development data
    await seed(devData);
  } catch (error) {
    console.error('Error running seed:', error);
  } finally {
    // Ensure the database connection is closed properly for non-production environments
    if (process.env.NODE_ENV !== 'production') {
      await db.end();
    }
  }
};


runSeed();
