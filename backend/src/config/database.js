const mongoose = require('mongoose');
const env = require('./env');

async function connectDatabase() {
  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 30000,  // was 10000, Atlas needs more time
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,                  // reuse up to 10 connections
      minPoolSize: 2,                   // keep 2 alive — avoids cold starts
      maxIdleTimeMS: 30000,
      heartbeatFrequencyMS: 10000,      // ping Atlas every 10s to stay alive
    });

    console.log('✓ MongoDB connected successfully');

    // Monitor connection health
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✓ MongoDB reconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('✗ MongoDB error:', err.message);
    });

    return mongoose;

  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    throw error;
  }
  // ✅ Removed duplicate dead code that was here
}

module.exports = { connectDatabase };