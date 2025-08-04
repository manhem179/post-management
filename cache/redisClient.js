// cache/redisClient.js
const { createClient } = require('redis');

let client;

const connectRedis = async () => {
  try {
    client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    await client.connect();
    console.log('🔌 Redis connected');
  } catch (err) {
    console.error('❌ Redis connect failed:', err);
    console.log('⚠️ Continuing without Redis cache...');
    
    // Create mock client
    client = {
      get: async () => null,
      set: async () => 'OK',
      flushAll: async () => 'OK',
      on: () => {},
      connect: async () => {}
    };
  }
};

// Export client
module.exports = client;
module.exports.connectRedis = connectRedis;
