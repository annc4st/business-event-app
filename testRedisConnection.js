require('dotenv').config({ path: './.env.development' });
const { createClient } = require('redis');

console.log('Environment variables:');
console.log(`REDIS_HOST: ${process.env.REDIS_HOST}`);
console.log(`REDIS_PASSWORD: ${process.env.REDIS_PASSWORD}`);
console.log(`REDIS_PORT: ${process.env.REDIS_PORT}`);

const redisClient = createClient({
//   password: 'nmK90O5Z8cHMGzEgX4HwAXksdP6xvwSy',
//   socket: {
//     host: 'redis-17292.c72.eu-west-1-2.ec2.redns.redis-cloud.com',
//     port: 17292

password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function testRedisConnection() {
  await redisClient.connect();
  console.log('Redis connection successful');
  await redisClient.quit();
}

testRedisConnection().catch(console.error);
