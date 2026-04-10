/**
 * FILE: paymentController.js
 * PURPOSE: Handle HTTP requests and responses for payment-related endpoints
 * DESCRIPTION: This controller receives API requests, validates input data,
 *              calls the payment service for business logic, and returns
 *              formatted JSON responses to the frontend. Acts as a bridge
 *              between HTTP requests and database operations.
 * 
 * FUNCTIONS:
 * - getOwnerBoardingPlaces(): API endpoint to fetch all boarding houses for an owner
 */

const paymentService = require('../services/paymentService');

/**
 * Get all boarding places (houses) for the authenticated owner
 * 
 * ROUTE: GET /api/payment/boarding-places
 * AUTH: Required (JWT token must contain userId)
 * 
 * REQUEST:
 * - Headers: { Authorization: "Bearer {token}" }
 * 
 * SUCCESS RESPONSE (200):
 * {
 *   success: true,
 *   message: "Boarding places fetched successfully",
 *   data: [
 *     {
 *       _id: "...",
 *       name: "Student Plaza Hostel",
 *       address: "124, Old Parliament Road",
 *       city: "Colombo",
 *       monthlyPrice: 19500,
 *       totalRooms: 5,
 *       totalTenants: 8,
 *       availableRooms: 2,
 *       status: "active"
 *     }
 *   ]
 * }
 * 
 * ERROR RESPONSE (404):
 * {
 *   success: false,
 *   message: "No boarding places found"
 * }
 * 
 * ERROR RESPONSE (500):
 * {
 *   success: false,
 *   message: "Failed to fetch boarding places",
 *   error: "error details"
 * }
 */
exports.getOwnerBoardingPlaces = async (req, res) => {
  try {
    // Extract user ID from JWT token (added by auth middleware)
    const ownerId = req.user.userId;

    console.log('🔐 DEBUG: JWT Token Contents');
    console.log('   Full req.user:', req.user);
    console.log('   Extracted userId:', ownerId);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User ID not found in token',
      });
    }

    // Call service to fetch boarding houses from database
    const boardingPlaces = await paymentService.getOwnerBoardingHouses(ownerId);

    // Check if any boarding places found
    if (!boardingPlaces || boardingPlaces.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No boarding places found',
      });
    }

    // Return success response with boarding places data
    return res.status(200).json({
      success: true,
      message: 'Boarding places fetched successfully',
      count: boardingPlaces.length,
      data: boardingPlaces,
    });
  } catch (error) {
    console.error('Error in getOwnerBoardingPlaces:', error);

    // Return error response
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch boarding places',
      error: error.message,
    });
  }
};

/**
 * Get payment summary/dashboard for a specific boarding house
 * 
 * ROUTE: GET /api/payment/house-summary/:houseId
 * AUTH: Required
 * 
 * PARAMS: houseId (MongoDB ObjectId)
 * 
 * SUCCESS RESPONSE (200):
 * {
 *   success: true,
 *   message: "House summary fetched",
 *   data: {
 *     houseName: "Student Plaza Hostel",
 *     expectedMonthlyIncome: 156000,
 *     capacityMonthlyIncome: 195000,
 *     occupancyPercentage: "80%"
 *   }
 * }
 * 
 * ERROR RESPONSE (404):
 * {
 *   success: false,
 *   message: "Boarding house not found"
 * }
 */
exports.getHouseSummary = async (req, res) => {
  try {
    const { houseId } = req.params;
    const ownerId = req.user.userId;

    if (!houseId) {
      return res.status(400).json({
        success: false,
        message: 'House ID is required',
      });
    }

    // Call service to calculate income and get summary
    const houseSummary = await paymentService.calculateHouseIncome(houseId);

    return res.status(200).json({
      success: true,
      message: 'House summary fetched successfully',
      data: houseSummary,
    });
  } catch (error) {
    console.error('Error in getHouseSummary:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch house summary',
      error: error.message,
    });
  }
};
