require('dotenv').config({ path: './.env.development' });

console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('REDIS_PASSWORD:', process.env.REDIS_PASSWORD);
console.log('REDIS_PORT:', process.env.REDIS_PORT);