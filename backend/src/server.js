const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');
const { setupChatSocket } = require('./socket/chatSocket');

let server;
let keepAliveInterval; // ✅ track it so we can clear on shutdown

async function startServer() {
  try {
    await connectDatabase();
    console.log('✓ Database connected successfully');

    // ====================== KEEP ATLAS ALIVE ======================
    // Pings Atlas every 5 min so M0 free tier never goes cold
    keepAliveInterval = setInterval(async () => {
      try {
        await mongoose.connection.db.admin().ping();
        console.log('✓ Atlas keep-alive ping sent');
      } catch (err) {
        console.warn('⚠️ Keep-alive ping failed:', err.message);
      }
    }, 5 * 60 * 1000); // every 5 minutes

    // ====================== ROUTE MOUNTING ======================

    try {
      const adminRoutes = require('./routes/adminRoutes');
      app.use('/api/admin', adminRoutes);
      console.log('✓ Admin routes mounted successfully');
    } catch (err) {
      console.error('✗ Failed to load adminRoutes:', err.message);
    }

    try {
      const authRoutes = require('./routes/authRoutes');
      app.use('/api/auth', authRoutes);
      console.log('✓ Auth routes mounted');
    } catch (e) {
      console.warn('⚠️ Auth routes not loaded');
    }

    try {
      const ownerRoutes = require('./routes/ownerRoutes');
      app.use('/api/owner', ownerRoutes);
      console.log('✓ Owner routes mounted');
    } catch (e) {
      console.warn('⚠️ Owner routes not loaded');
    }

    try {
      const roommateRoutes = require('./routes/roommateRoutes');
      app.use('/api/roommates', roommateRoutes);
      console.log('✓ Roommate routes mounted');
    } catch (e) {
      console.warn('⚠️ Roommate routes not loaded');
    }

    try {
      const chatRoutes = require('./routes/chatRoutes');
      app.use('/api/chats', chatRoutes);
      console.log('✓ Chat routes mounted');
    } catch (e) {
      console.warn('⚠️ Chat routes not loaded');
    }

    try {
      const notificationRoutes = require('./routes/notificationRoutes');
      app.use('/api/notifications', notificationRoutes);
      console.log('✓ Notification routes mounted');
    } catch (e) {
      console.warn('⚠️ Notification routes not loaded');
    }

    // Health check route
    app.get('/api/health', (req, res) => {
      res.json({
        success: true,
        message: 'Server is running',
        environment: env.nodeEnv || 'production',
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' // ✅ useful to see db status
      });
    });

    // 404 handler - MUST BE LAST
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
      });
    });

    // ====================== START SERVER ======================
    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: env.allowedOrigins || '*',
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true,
      },
    });

    setupChatSocket(io);
    app.locals.io = io;

    server = httpServer.listen(env.port, () => {
      console.log(`✓ Server running on port ${env.port}`);
      console.log(`✓ Environment: ${env.nodeEnv}`);
      console.log(`✓ Health check: /api/health`);
      console.log(`✓ Atlas keep-alive: every 5 minutes`);
    });

  } catch (error) {
    console.error('✗ Server startup failed:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);
  clearInterval(keepAliveInterval); // ✅ stop ping on shutdown
  if (server) {
    server.close(async () => {
      await mongoose.connection.close(false);
      console.log('✓ Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();