require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

const corsOriginRaw = process.env.CORS_ORIGIN || '';
const corsOrigins = corsOriginRaw
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
  }),
);
app.locals.mongoReady = false;

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roommatefinder';
mongoose
  .connect(mongoUri)
  .then(() => {
    app.locals.mongoReady = true;
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    app.locals.mongoReady = false;
    console.warn('MongoDB unavailable. Booking API is running in memory mode.');
    console.warn(error.message);
  });

const db = mongoose.connection;
db.on('error', (error) => {
  app.locals.mongoReady = false;
  console.warn('MongoDB connection error:');
  console.warn(error.message);
});
db.on('connected', () => {
  app.locals.mongoReady = true;
});
db.on('disconnected', () => {
  app.locals.mongoReady = false;
});

// Routes
app.use('/api/roommates', require('./routes/roommates'));
app.use('/api/bookings', require('./routes/bookings'));

// Health check
app.get('/', (req, res) => {
  res.send('Roommate Finder API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
