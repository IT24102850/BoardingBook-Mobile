const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Get all notifications (optionally unread only)
router.get('/', requireAuth, notificationController.getNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', requireAuth, notificationController.markAsRead);

// Mark all as read
router.patch('/read-all', requireAuth, notificationController.markAllAsRead);

// Delete a notification
router.delete('/:notificationId', requireAuth, notificationController.deleteNotification);

module.exports = router;
