require('dotenv').config({ path: './.env.production' });
const { createClient } = require('redis');

console.log('Environment variables:');
console.log(`REDIS_HOST: ${process.env.REDIS_HOST}`);
console.log(`REDIS_PASSWORD: ${process.env.REDIS_PASSWORD}`);
console.log(`REDIS_PORT: ${process.env.REDIS_PORT}`);

const redisClient = createClient({
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
