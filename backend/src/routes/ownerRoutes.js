const express = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const ownerController = require('../controllers/ownerController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();


router.get('/public/houses', ownerController.getPublicHouses);


router.get('/houses', requireAuth, ownerController.getHouses);

router.post(
  '/houses',
  requireAuth,
  [
    body('name').notEmpty().withMessage('House name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('monthlyPrice').optional().isNumeric().withMessage('Price must be a number'),
    body('deposit').optional().isNumeric().withMessage('Deposit must be a number'),
    body('genderPreference')
      .optional()
      .isIn(['any', 'girls', 'boys'])
      .withMessage('Gender preference must be any, girls, or boys'),
  ],
  validateRequest,
  ownerController.createHouse
);

router.patch('/houses/:houseId', requireAuth, ownerController.updateHouse);
router.delete('/houses/:houseId', requireAuth, ownerController.deleteHouse);

router.get('/rooms', requireAuth, ownerController.getRooms);

router.post(
  '/rooms',
  requireAuth,
  [
    body('location').notEmpty().withMessage('Location is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('bedCount').isInt({ min: 1 }).withMessage('Bed count must be at least 1'),
    body('roomNumber').notEmpty().withMessage('Room number is required'),
  ],
  validateRequest,
  ownerController.createRoom
);

router.patch('/rooms/:roomId', requireAuth, ownerController.updateRoom);
router.delete('/rooms/:roomId', requireAuth, ownerController.deleteRoom);

// Payment-related endpoints
router.get('/payment-slips', requireAuth, ownerController.getPendingPaymentSlips);
router.get('/payment-slips/:slipId/download', requireAuth, ownerController.downloadPaymentSlip);
router.post('/payment-slips/:slipId/approve', requireAuth, ownerController.approvePaymentSlip);
router.post('/payment-slips/:slipId/reject', requireAuth, ownerController.rejectPaymentSlip);

// Financial overview
router.get('/financial-overview', requireAuth, ownerController.getFinancialOverview);
router.get('/payment-history', requireAuth, ownerController.getPaymentHistory);

// Booking requests and digital agreements
router.get('/booking-requests', requireAuth, bookingController.getOwnerBookingRequests);
router.patch(
  '/booking-requests/:requestId/status',
  requireAuth,
  [body('status').isIn(['approved', 'rejected'])],
  validateRequest,
  bookingController.updateBookingRequestStatus
);
router.get('/agreements', requireAuth, bookingController.getOwnerAgreements);
router.post(
  '/agreements',
  requireAuth,
  [
    body('bookingRequestId').isMongoId().withMessage('bookingRequestId is required'),
    body('title').isLength({ min: 5, max: 200 }).withMessage('title must be 5-200 characters'),
    body('terms').isLength({ min: 20, max: 10000 }).withMessage('terms must be 20-10000 characters'),
    body('rentAmount').isFloat({ min: 0 }).withMessage('rentAmount must be a positive number'),
    body('depositAmount').optional().isFloat({ min: 0 }).withMessage('depositAmount must be positive'),
    body('periodStart').isISO8601().withMessage('periodStart must be a valid date'),
    body('periodEnd').isISO8601().withMessage('periodEnd must be a valid date'),
  ],
  validateRequest,
  bookingController.createAgreementForRequest
);

module.exports = router;
