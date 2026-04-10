/**
 * FILE: paymentService.js
 * PURPOSE: Business logic for payment-related database operations
 * DESCRIPTION: This service handles all payment data fetching from MongoDB,
 *              including retrieving owner's boarding houses, room details,
 *              and payment calculations. Keeps database queries separate
 *              from API controllers.
 * 
 * METHODS:
 * - getOwnerBoardingHouses(): Fetch all boarding places for a specific owner
 * - getHouseRooms(): Fetch all rooms in a boarding house
 * - calculateTotalIncome(): Calculate total income from a house
 */

const BoardingHouse = require('../../models/BoardingHouse');
const Room = require('../../models/Room');

/**
 * Get all boarding houses for a specific owner
 * @param {String} ownerId - The ID of the owner
 * @returns {Array} Array of boarding houses with room counts and financial data
 * @throws {Error} If database query fails
 */
exports.getOwnerBoardingHouses = async (ownerId) => {
  try {
    // Validate owner ID
    if (!ownerId) {
      throw new Error('Owner ID is required');
    }

    console.log('🔍 DEBUG: Searching for boarding houses');
    console.log('   ownerId from JWT:', ownerId);
    console.log('   ownerId type:', typeof ownerId);

    // Query: Find all boarding houses where ownerId matches
    const boardingHouses = await BoardingHouse.find({ ownerId: ownerId }).select(
      'name address city monthlyPrice roomCount status createdAt updatedAt ownerId'
    );

    console.log('📊 DEBUG: Query result');
    console.log('   Found houses:', boardingHouses.length);
    if (boardingHouses.length > 0) {
      console.log('   First house ownerId:', boardingHouses[0].ownerId);
    }

    // If no boarding houses found, return empty array
    if (!boardingHouses || boardingHouses.length === 0) {
      return [];
    }

    // Enhance with additional data (room counts, tenant info)
    const enrichedHouses = await Promise.all(
      boardingHouses.map(async (house) => {
        // Get room statistics for this house
        const rooms = await Room.find({ houseId: house._id });
        const totalTenants = rooms.reduce((sum, room) => sum + room.occupancy, 0);

        return {
          ...house.toObject(),
          totalRooms: rooms.length,
          totalTenants: totalTenants,
          availableRooms: rooms.filter(r => r.occupancy < r.totalSpots).length,
        };
      })
    );

    // Debug log to check for duplicates
    const uniqueIds = new Set(enrichedHouses.map(h => h._id.toString()));
    console.log('📦 Enriched Houses Summary:');
    console.log('   Total returned:', enrichedHouses.length);
    console.log('   Unique IDs:', uniqueIds.size);
    if (enrichedHouses.length > uniqueIds.size) {
      console.warn('⚠️ WARNING: Duplicates detected in response!');
      enrichedHouses.forEach((h, i) => console.log(`   [${i}] ${h.name} (${h._id})`));
    }

    return enrichedHouses;
  } catch (error) {
    console.error('Error fetching owner boarding houses:', error);
    throw error;
  }
};

/**
 * Get all rooms for a specific boarding house
 * @param {String} houseId - The ID of the boarding house
 * @returns {Array} Array of rooms in the house
 * @throws {Error} If database query fails
 */
exports.getHouseRooms = async (houseId) => {
  try {
    if (!houseId) {
      throw new Error('House ID is required');
    }

    // Query: Find all rooms for the specific house
    const rooms = await Room.find({ houseId: houseId }).select(
      'name floor bedCount price totalSpots occupancy facilities roomType'
    );

    return rooms;
  } catch (error) {
    console.error('Error fetching house rooms:', error);
    throw error;
  }
};

/**
 * Calculate total expected monthly income for a boarding house
 * @param {String} houseId - The ID of the boarding house
 * @returns {Object} Total income calculation breakdown
 */
exports.calculateHouseIncome = async (houseId) => {
  try {
    if (!houseId) {
      throw new Error('House ID is required');
    }

    // Get the house details
    const house = await BoardingHouse.findById(houseId);
    if (!house) {
      throw new Error('Boarding house not found');
    }

    // Get all rooms in the house
    const rooms = await Room.find({ houseId: houseId });

    // Calculate total expected income (occupancy based)
    let totalExpectedIncome = 0;
    rooms.forEach((room) => {
      totalExpectedIncome += room.occupancy * room.price;
    });

    // Calculate total possible income (full capacity)
    let totalCapacityIncome = 0;
    rooms.forEach((room) => {
      totalCapacityIncome += room.totalSpots * room.price;
    });

    return {
      houseName: house.name,
      expectedMonthlyIncome: totalExpectedIncome,
      capacityMonthlyIncome: totalCapacityIncome,
      occupancyPercentage: ((totalExpectedIncome / totalCapacityIncome) * 100).toFixed(2),
    };
  } catch (error) {
    console.error('Error calculating house income:', error);
    throw error;
  }
};
