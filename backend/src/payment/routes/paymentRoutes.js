/**
 * FILE: paymentRoutes.js
 * PURPOSE: Define API routes for payment-related endpoints
 * DESCRIPTION: Maps HTTP methods and URL paths to their corresponding
 *              controller functions. All routes require authentication
 *              middleware to verify JWT tokens. Routes are prefixed with
 *              /api/payment in the main app.js
 * 
 * ROUTES:
 * - GET /boarding-places - Fetch all owner's boarding places
 * - GET /house-summary/:houseId - Get payment summary for a house
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireAuth } = require('../../middleware/auth'); // JWT authentication middleware - ✅ FIXED: Destructure requireAuth

/**
 * GET /api/payment/boarding-places
 * Fetch all boarding places (houses) for the authenticated owner
 * 
 * Middleware: auth - Verifies JWT token and extracts userId
 * 
 * Query Parameters: None
 * 
 * Response: 200 - Array of boarding places
 *           401 - Unauthorized (invalid token)
 *           404 - No boarding places found
 *           500 - Server error
 */
router.get('/boarding-places', requireAuth, paymentController.getOwnerBoardingPlaces);

/**
 * GET /api/payment/house-summary/:houseId
 * Get payment summary and income data for a specific boarding house
 * 
 * Middleware: requireAuth - Verifies JWT token and extracts userId
 * 
 * URL Parameters:
 * - houseId (required): MongoDB ObjectId of the boarding house
 * 
 * Response: 200 - House summary with income calculations
 *           400 - Missing required parameters
 *           404 - House not found
 *           500 - Server error
 */
router.get('/house-summary/:houseId', requireAuth, paymentController.getHouseSummary);

module.exports = router;
