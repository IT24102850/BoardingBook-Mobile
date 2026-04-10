const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const isDevelopment = env.nodeEnv !== 'production';

// Security middleware setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 5000 : 300,
  standardHeaders: true,
  legacyHeaders: false,
  // Avoid throttling local development traffic while preserving production protection.
  skip: (req) => {
    if (!isDevelopment) return false;
    const origin = String(req.headers.origin || '');
    const host = String(req.headers.host || '');
    const localhostOrigin = origin.includes('localhost') || origin.includes('127.0.0.1');
    const localhostHost = host.includes('localhost') || host.includes('127.0.0.1');
    return localhostOrigin || localhostHost;
  },
});

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      console.log('[CORS] Incoming request origin:', origin);
      console.log('[CORS] Allowed origins:', env.allowedOrigins);
      if (!origin || env.allowedOrigins.includes(origin)) {
        console.log('[CORS] Origin allowed:', origin);
        return callback(null, true);
      }
      console.log('[CORS] Origin NOT allowed:', origin);
      return callback(new Error('CORS not allowed'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: false, limit: '25mb' }));
app.use(limiter);
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// Import routes
const authRoutes = require('./routes/authRoutes');
const roommateRoutes = require('./routes/roommateRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./payment/routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const kycRoutes = require('./routes/kycRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/roommates', roommateRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'Server is running',
    environment: env.nodeEnv,
  });
});

// Debug endpoint - list all rooms  
app.get('/api/debug/rooms', async (req, res) => {
  try {
    const Room = require('./models/Room');
    const rooms = await Room.find({}).limit(5);
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms.map(r => ({
        id: String(r._id),
        name: r.name,
        price: r.price,
        campus: r.campus,
        rating: r.rating,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug endpoint - list all users (remove in production)
app.get('/api/debug/users', async (req, res) => {
  try {
    const User = require('./models/User');
    const users = await User.find({}).select('_id email fullName role profilePicture');
    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(u => ({
        id: String(u._id),
        email: u.email,
        fullName: u.fullName || '(no name)',
        role: u.role,
        avatar: u.profilePicture || '',
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug endpoint - list all conversations (remove in production)
app.get('/api/debug/conversations', async (req, res) => {
  try {
    const ChatConversation = require('./models/ChatConversation');
    const conversations = await ChatConversation.find({})
      .populate('participants.user', '_id email fullName role')
      .populate('lastMessage.sender', '_id email fullName');
    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations: conversations.map(c => ({
        id: String(c._id),
        type: c.type,
        directKey: c.directKey,
        name: c.name,
        participants: (c.participants || []).map(p => ({
          userId: p.user ? String(p.user._id) : 'unknown',
          email: p.user?.email || 'unknown',
          fullName: p.user?.fullName || 'unknown',
        })),
        lastMessage: c.lastMessage?.text?.substring(0, 50) || 'none',
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Public platform stats (no auth required)
app.get('/api/stats', async (req, res) => {
  try {
    const User = require('./models/User');
    const BoardingHouse = require('./models/BoardingHouse');
    const Review = require('./admin/models/Review');

    const [listings, students, owners, reviewAgg] = await Promise.all([
      BoardingHouse.countDocuments({ isActive: { $ne: false } }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'owner' }),
      Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]),
    ]);

    const avgRating = reviewAgg.length > 0 ? Math.round(reviewAgg[0].avg * 10) / 10 : 4.9;

    res.status(200).json({ success: true, data: { listings, students, owners, avgRating } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats', error: err.message });
  }
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
