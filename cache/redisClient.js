// cache/redisClient.js
const { createClient } = require('redis');

// Create mock client by default
let client = {
  get: async () => null,
  set: async () => 'OK',
  flushAll: async () => 'OK',
  on: () => {},
  connect: async () => {}
};

const connectRedis = async () => {
  try {
    const redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    await redisClient.connect();
    console.log('🔌 Redis connected');
    
    // Replace mock client with real client
    client = redisClient;
  } catch (err) {
    console.error('❌ Redis connect failed:', err);
    console.log('⚠️ Continuing without Redis cache...');
    // Keep using mock client
  }
};

// Export client
module.exports = client;
module.exports.connectRedis = connectRedis;
