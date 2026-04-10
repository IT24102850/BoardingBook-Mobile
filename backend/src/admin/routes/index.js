const express = require('express');
const router = express.Router();

const adminAuth = require('../middleware/adminAuth');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const ticketController = require('../controllers/ticketController');
const reviewController = require('../controllers/reviewController');

// ── Auth (public) ─────────────────────────────────────────────
router.post('/login', authController.login);

// All routes below require a valid admin JWT
router.use(adminAuth);

// ── Admin profile ─────────────────────────────────────────────
router.get('/me', authController.getMe);
router.patch('/password', authController.changePassword);

// ── Dashboard stats ───────────────────────────────────────────
router.get('/stats', userController.getStats);
router.get('/signup-chart', userController.getSignupChart);

// ── User management ───────────────────────────────────────────
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.patch('/users/:id/ban', userController.banUser);
router.patch('/users/:id/unban', userController.unbanUser);
router.delete('/users/:id', userController.deleteUser);
router.get('/users/:id/activity', userController.getUserActivity);

// ── KYC management ────────────────────────────────────────────
router.get('/kyc', userController.getKycSubmissions);
router.patch('/kyc/:id/approve', userController.approveKyc);
router.patch('/kyc/:id/reject', userController.rejectKyc);

// ── Support tickets ───────────────────────────────────────────
router.get('/tickets/stats', ticketController.getTicketStats);
router.get('/tickets', ticketController.getAllTickets);
router.get('/tickets/:id', ticketController.getTicketById);
router.patch('/tickets/:id/status', ticketController.updateStatus);
router.post('/tickets/:id/reply', ticketController.replyToTicket);

// ── Reviews / Feedback ────────────────────────────────────────
router.get('/reviews/stats', reviewController.getReviewStats);
router.get('/reviews', reviewController.getAllReviews);
router.patch('/reviews/:id/flag', reviewController.flagReview);
router.patch('/reviews/:id/unflag', reviewController.unflagReview);
router.delete('/reviews/:id', reviewController.deleteReview);

module.exports = router;
