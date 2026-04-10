const jwt = require('jsonwebtoken');
const ChatConversation = require('../models/ChatConversation');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const env = require('../config/env');

function getToken(socket) {
  const authToken = socket.handshake?.auth?.token;
  if (authToken) return String(authToken).replace(/^Bearer\s+/i, '');

  const headerValue = socket.handshake?.headers?.authorization;
  if (headerValue && typeof headerValue === 'string') {
    return headerValue.replace(/^Bearer\s+/i, '');
  }

  return '';
}

async function findConversationForUser(conversationId, userId) {
  return ChatConversation.findOne({
    _id: conversationId,
    'participants.user': userId,
  });
}

function setupChatSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = getToken(socket);
      if (!token) {
        return next(new Error('Unauthorized'));
      }

      const payload = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(payload.userId).select('fullName email profilePicture role');
      if (!user) {
        return next(new Error('Unauthorized'));
      }

      socket.data.user = {
        id: String(user._id),
        fullName: user.fullName || '',
        email: user.email || '',
        avatar: user.profilePicture || '',
        role: user.role || 'student',
      };

      return next();
    } catch {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const currentUser = socket.data.user;
    const userRoom = `user:${currentUser.id}`;
    socket.join(userRoom);

    socket.on('conversation:join', async (conversationId, callback) => {
      try {
        if (!conversationId) {
          throw new Error('conversationId is required');
        }

        const conversation = await findConversationForUser(conversationId, currentUser.id);
        if (!conversation) {
          throw new Error('Conversation not found');
        }

        socket.join(`conversation:${conversationId}`);
        if (typeof callback === 'function') {
          callback({ ok: true });
        }
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ ok: false, message: error.message });
        }
      }
    });

    socket.on('conversation:leave', (conversationId) => {
      if (!conversationId) return;
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('message:send', async (payload, callback) => {
      try {
        const conversationId = payload?.conversationId;
        const content = String(payload?.content || '').trim();

        if (!conversationId || !content) {
          throw new Error('conversationId and content are required');
        }

        const conversation = await findConversationForUser(conversationId, currentUser.id);
        if (!conversation) {
          throw new Error('Conversation not found');
        }

        const message = await ChatMessage.create({
          conversation: conversationId,
          sender: currentUser.id,
          content,
          readBy: [currentUser.id],
        });

        await ChatConversation.updateOne(
          { _id: conversationId },
          {
            $set: {
              lastMessage: {
                text: content,
                sender: currentUser.id,
                at: message.createdAt,
              },
              updatedAt: new Date(),
            },
          }
        );

        const outgoing = {
          id: String(message._id),
          conversationId: String(conversationId),
          sender: currentUser,
          content,
          messageType: 'text',
          createdAt: message.createdAt,
          mine: true,
        };

        io.to(`conversation:${conversationId}`).emit('message:new', outgoing);

        if (typeof callback === 'function') {
          callback({ ok: true, data: outgoing });
        }
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ ok: false, message: error.message || 'Unable to send message' });
        }
      }
    });

    socket.on('call:initiate', async (payload, callback) => {
      try {
        const conversationId = payload?.conversationId;
        const targetUserId = payload?.targetUserId;
        const callType = payload?.callType === 'video' ? 'video' : 'audio';

        if (!conversationId || !targetUserId) {
          throw new Error('conversationId and targetUserId are required');
        }

        const conversation = await findConversationForUser(conversationId, currentUser.id);
        if (!conversation) {
          throw new Error('Conversation not found');
        }

        io.to(`user:${targetUserId}`).emit('call:incoming', {
          conversationId,
          fromUser: currentUser,
          callType,
        });

        if (typeof callback === 'function') {
          callback({ ok: true });
        }
      } catch (error) {
        if (typeof callback === 'function') {
          callback({ ok: false, message: error.message || 'Unable to initiate call' });
        }
      }
    });

    socket.on('call:accept', (payload) => {
      if (!payload?.targetUserId || !payload?.conversationId) return;
      io.to(`user:${payload.targetUserId}`).emit('call:accepted', {
        conversationId: payload.conversationId,
        fromUserId: currentUser.id,
        callType: payload.callType === 'video' ? 'video' : 'audio',
      });
    });

    socket.on('call:decline', (payload) => {
      if (!payload?.targetUserId || !payload?.conversationId) return;
      io.to(`user:${payload.targetUserId}`).emit('call:declined', {
        conversationId: payload.conversationId,
        fromUserId: currentUser.id,
      });
    });

    socket.on('call:end', (payload) => {
      if (!payload?.targetUserId || !payload?.conversationId) return;
      io.to(`user:${payload.targetUserId}`).emit('call:ended', {
        conversationId: payload.conversationId,
        fromUserId: currentUser.id,
      });
    });

    socket.on('call:signal', (payload) => {
      if (!payload?.targetUserId || !payload?.conversationId || !payload?.signal) return;
      io.to(`user:${payload.targetUserId}`).emit('call:signal', {
        conversationId: payload.conversationId,
        fromUserId: currentUser.id,
        signal: payload.signal,
      });
    });
  });
}

module.exports = {
  setupChatSocket,
};
