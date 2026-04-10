const express = require('express');
const { body } = require('express-validator');
const chatController = require('../controllers/chatController');
const { requireAuth } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/contacts', requireAuth, chatController.getDirectContacts);

router.get('/conversations', requireAuth, chatController.getConversations);

router.post(
  '/conversations/direct',
  requireAuth,
  [body('recipientId').isMongoId()],
  validateRequest,
  chatController.getOrCreateDirectConversation
);

router.post('/conversations/group', requireAuth, chatController.getOrCreateGroupConversation);

router.get('/conversations/:conversationId/messages', requireAuth, chatController.getConversationMessages);

router.post(
  '/conversations/:conversationId/messages',
  requireAuth,
  [body('content').isString().isLength({ min: 1, max: 2000 })],
  validateRequest,
  chatController.sendMessage
);

router.patch('/conversations/:conversationId/read', requireAuth, chatController.markConversationRead);

module.exports = router;
