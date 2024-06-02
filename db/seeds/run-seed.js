const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const superUser = {
  google_id: '118198828170823943386',
  username:  'Anna Seniuta',
  email: 'annaseniuta@gmail.com',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocLuXf9zaI9b2Hd86egpWDs07j6pjVLdv85uN1DcoOq_ANebfa0=s96-c',
};

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
