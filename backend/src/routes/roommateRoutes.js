



const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');


const roommateController = require('../controllers/roommateController');
const requestController = require('../controllers/requestController');
const groupController = require('../controllers/groupController');
const roomController = require('../controllers/roomController');
const bookingController = require('../controllers/bookingController');

// Redis test route
const { redis } = require('../lib/redis');
router.get('/test-cache', async (req, res) => {
  await redis.set('test', 'connected');
  const val = await redis.get('test');
  res.json({ value: val });
});


// ============ ROOMMATE PROFILE ROUTES ============

// Create or update profile
router.post(
  '/profile',
  requireAuth,
  [
    body('budget').isInt({ min: 5000, max: 50000 }),
    body('gender').isIn(['Male', 'Female', 'Other']),
    body('academicYear').isIn(['1st Year', '2nd Year', '3rd Year', '4th Year']),
    body('roomType').isIn(['Single Room', 'Shared Room']),
    body('availableFrom').isISO8601().toDate(),
  ],
  validateRequest,
  roommateController.createOrUpdateProfile
);

// Get current user's profile
router.get('/profile', requireAuth, roommateController.getMyProfile);

// Browse roommate profiles (with filters)
router.get('/browse', requireAuth, roommateController.browseProfiles);

// Swipe on profile (Tinder-style)
router.post(
  '/swipe',
  requireAuth,
  [
    body('profileId').isMongoId(),
    body('action').isIn(['like', 'pass']),
  ],
  validateRequest,
  roommateController.swipeProfile
);

// Get liked profiles
router.get('/liked', requireAuth, roommateController.getLikedProfiles);

// Get mutual matches
router.get('/mutual', requireAuth, roommateController.getMutualMatches);

// ============ ROOMMATE REQUEST ROUTES ============

// Send request
router.post(
  '/request/send',
  requireAuth,
  [
    body('recipientId').isMongoId(),
    body('message').isLength({ min: 10, max: 500 }),
  ],
  validateRequest,
  requestController.sendRequest
);

// Get inbox requests
router.get('/request/inbox', requireAuth, requestController.getInboxRequests);

// Get sent requests
router.get('/request/sent', requireAuth, requestController.getSentRequests);

// Get specific request
router.get('/request/:requestId', requireAuth, requestController.getRequest);

// Accept request
router.patch(
  '/request/:requestId/accept',
  requireAuth,
  requestController.acceptRequest
);

// Reject request
router.patch(
  '/request/:requestId/reject',
  requireAuth,
  requestController.rejectRequest
);

// ============ BOOKING GROUP ROUTES ============

// Create group
router.post(
  '/group',
  requireAuth,
  [
    body('memberEmails').isArray({ min: 1 }),
    body('scenario').optional().isIn(['join-existing', 'new-place']),
    body('roomId').optional().isMongoId(),
    body('name').optional().isLength({ min: 3, max: 100 }),
  ],
  validateRequest,
  groupController.createGroup
);

// Get user's groups
router.get('/groups', requireAuth, groupController.getUserGroups);

// Get specific group
router.get('/group/:groupId', requireAuth, groupController.getGroup);

// Add member to group
router.post(
  '/group/:groupId/member',
  requireAuth,
  [body('memberEmail').isEmail()],
  validateRequest,
  groupController.addGroupMember
);

// Remove member from group
router.delete(
  '/group/:groupId/member/:memberId',
  requireAuth,
  groupController.removeGroupMember
);

// Respond to group invite
router.patch(
  '/group/:groupId/respond',
  requireAuth,
  [body('status').isIn(['accepted', 'rejected'])],
  validateRequest,
  groupController.respondToGroupInvite
);

// Update group status
router.patch(
  '/group/:groupId/status',
  requireAuth,
  [body('status').isIn(['forming', 'ready', 'booked'])],
  validateRequest,
  groupController.updateGroupStatus
);

// ============ ROOM ROUTES ============


// Get all rooms (with advanced filtering)
router.get('/rooms', roomController.getAllRooms);

// Get nearby rooms (geospatial search)
router.get('/rooms/nearby', roomController.getNearbyRooms);


// Get all rooms
router.get('/rooms', roomController.getAllRooms);


// Get specific room
router.get('/room/:roomId', roomController.getRoom);

// Create room (admin/owner only)
router.post(
  '/room',
  requireAuth,
  [
    body('name').notEmpty(),
    body('location').notEmpty(),
    body('price').isInt({ min: 5000, max: 50000 }),
    body('totalSpots').isInt({ min: 1 }),
  ],
  validateRequest,
  roomController.createRoom
);

// Update room
router.patch(
  '/room/:roomId',
  requireAuth,
  roomController.updateRoom
);

// Update room occupancy
router.patch(
  '/room/:roomId/occupancy',
  requireAuth,
  [body('occupancy').isInt({ min: 0 })],
  validateRequest,
  roomController.updateOccupancy
);


// ============ SAVED SEARCH ROUTES ============

// Save a search
router.post(
  '/search/save',
  requireAuth,
  [
    body('name').isLength({ min: 1, max: 100 }),
    body('filters').isObject(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const SavedSearch = require('../models/SavedSearch');
      const { name, filters } = req.body;
      const userId = req.user.id;

      const savedSearch = new SavedSearch({
        userId,
        name,
        filters,
      });

      await savedSearch.save();

      res.status(201).json({
        success: true,
        message: 'Search saved successfully',
        data: savedSearch,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error saving search',
        error: error.message,
      });
    }
  }
);

// Get user's saved searches
router.get('/search/saved', requireAuth, async (req, res) => {
  try {
    const SavedSearch = require('../models/SavedSearch');
    const userId = req.user.id;

    const searches = await SavedSearch.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: searches.length,
      data: searches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching saved searches',
      error: error.message,
    });
  }
});

// Get specific saved search
router.get('/search/saved/:searchId', requireAuth, async (req, res) => {
  try {
    const SavedSearch = require('../models/SavedSearch');
    const { searchId } = req.params;
    const userId = req.user.id;

    const search = await SavedSearch.findOne({
      _id: searchId,
      userId,
    });

    if (!search) {
      return res.status(404).json({
        success: false,
        message: 'Saved search not found',
      });
    }

    // Update lastUsed
    search.lastUsed = Date.now();
    await search.save();

    res.status(200).json({
      success: true,
      data: search,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching saved search',
      error: error.message,
    });
  }
});

// Update saved search
router.patch('/search/saved/:searchId', requireAuth, async (req, res) => {
  try {
    const SavedSearch = require('../models/SavedSearch');
    const { searchId } = req.params;
    const { name, filters } = req.body;
    const userId = req.user.id;

    const search = await SavedSearch.findOneAndUpdate(
      { _id: searchId, userId },
      { name, filters, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!search) {
      return res.status(404).json({
        success: false,
        message: 'Saved search not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Search updated successfully',
      data: search,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating saved search',
      error: error.message,
    });
  }
});

// Delete saved search
router.delete('/search/saved/:searchId', requireAuth, async (req, res) => {
  try {
    const SavedSearch = require('../models/SavedSearch');
    const { searchId } = req.params;
    const userId = req.user.id;

    const search = await SavedSearch.findOneAndDelete({
      _id: searchId,
      userId,
    });

    if (!search) {
      return res.status(404).json({
        success: false,
        message: 'Saved search not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Search deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting saved search',
      error: error.message,
    });
  }
});

// ============ BOOKING REQUEST & AGREEMENT ROUTES ============

router.post(
  '/booking-request',
  requireAuth,
  [
    body('roomId').isMongoId().withMessage('roomId is required'),
    body('bookingType').optional().isIn(['individual', 'group']),
    body('groupSize').optional().isInt({ min: 1, max: 20 }),
    body('moveInDate').isISO8601().withMessage('moveInDate must be a valid date'),
    body('durationMonths').optional().isInt({ min: 1, max: 36 }),
  ],
  validateRequest,
  bookingController.createBookingRequest
);

router.get('/booking-requests', requireAuth, bookingController.getMyBookingRequests);
router.get('/agreements', requireAuth, bookingController.getMyAgreements);
router.patch(
  '/agreements/:agreementId/respond',
  requireAuth,
  [body('status').isIn(['accepted', 'rejected'])],
  validateRequest,
  bookingController.respondToAgreement
);

module.exports = router;
