const path = require('path');
const dotenv = require('dotenv');

// ✅ Change to this
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function parseAllowedOrigins() {
  const raw = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173';
  return raw.split(',').map(o => o.trim()).filter(Boolean);
}

function getFrontendUrl() {
  const value = process.env.FRONTEND_URL || 'http://localhost:5173';
  return value.replace(/\/$/, '');
}

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoUri) throw new Error('Missing required environment variable: MONGO_URI');

const env = {
  nodeEnv:          process.env.NODE_ENV || 'development',
  port:             Number(process.env.PORT || 5000),
  mongoUri,
  jwtSecret:        requireEnv('JWT_SECRET'),
  jwtExpiresIn:     process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl:      getFrontendUrl(),
  allowedOrigins:   parseAllowedOrigins(),
  emailHost:        process.env.EMAIL_HOST || '',
  emailPort:        Number(process.env.EMAIL_PORT || 587),
  emailUser:        process.env.EMAIL_USER || '',
  emailPassword:    process.env.EMAIL_PASSWORD || '',
  emailFromName:    process.env.EMAIL_FROM_NAME || 'Boarding Book',
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || '',
};

console.log('[ENV] mongoUri loaded:', mongoUri ? '✅ Found' : '❌ Missing');

module.exports = env;