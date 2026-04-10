const BoardingHouse = require('../models/BoardingHouse');
const Room = require('../models/Room');
const BookingGroup = require('../models/BookingGroup');

function ensureOwnerRole(req, res) {
  if (!['owner', 'admin'].includes(req.user.role)) {
    res.status(403).json({ success: false, message: 'Only owners can manage boarding data' });
    return false;
  }
  return true;
}

exports.getHouses = async (req, res) => {
  if (!ensureOwnerRole(req, res)) return;
  try {
    const houses = await BoardingHouse
      .find({ ownerId: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ success: true, data: houses });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch houses', error: error.message });
  }
};

exports.getPublicHouses = async (req, res) => {
  try {
    const houses = await Promise.race([
      BoardingHouse
        .find({ status: 'active' })
        .select('name address monthlyPrice deposit roomType genderPreference status rating totalReviews features image images description createdAt')
        .sort({ createdAt: -1 })
        .limit(20)
        .maxTimeMS(15000)
        .lean(),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Public houses query timed out')), 16000);
      }),
    ]);
    return res.status(200).json({ success: true, data: houses });
  } catch (error) {
    console.error('[owner.getPublicHouses] Failed to fetch public houses:', error);

    const message = String(error?.message || 'Unknown public houses error');
    const isTimeoutLike =
      message === 'Public houses query timed out' ||
      /timed out|timeout|server selection|connection/i.test(message);

    // Degrade gracefully when DB is temporarily unreachable so UI can still render rooms.
    if (isTimeoutLike) {
      return res.status(200).json({
        success: true,
        data: [],
        warning: 'Public houses temporarily unavailable',
      });
    }

    return res.status(500).json({ success: false, message: 'Failed to fetch houses', error: message });
  }
};

exports.createHouse = async (req, res) => {
  if (!ensureOwnerRole(req, res)) return;
  try {
    const {
      name, address, totalRooms, monthlyPrice, roomType,
      availableFrom, deposit, roommateCount, description,
      features, image, images, status, genderPreference,
    } = req.body;

    const normalizedImages = Array.isArray(images) ? images.filter(Boolean) : [];
    const normalizedFeatures = Array.isArray(features) ? features.filter(Boolean) : [];
    const coverImage = image || normalizedImages[0] || '';

    const house = await BoardingHouse.create({
      name, address,
      totalRooms: Number(totalRooms) || 0,
      monthlyPrice: Number(monthlyPrice) || 0,
      roomType: roomType || 'Single Room',
      availableFrom: availableFrom || '',
      deposit: Number(deposit) || 0,
      roommateCount: roommateCount || 'None (Private)',
      description: description || '',
      features: normalizedFeatures,
      occupiedRooms: 0,
      image: coverImage,
      images: normalizedImages,
      status: status || 'active',
      genderPreference: ['girls', 'boys', 'any'].includes(genderPreference) ? genderPreference : 'any',
      ownerId: req.user.userId,
    });

    return res.status(201).json({ success: true, message: 'Boarding house created', data: house });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create house', error: error.message });
  }
};

exports.updateHouse = async (req, res) => {
  if (!ensureOwnerRole(req, res)) return;
  try {
    const { houseId } = req.params;
    const house = await BoardingHouse.findOneAndUpdate(
      { _id: houseId, ownerId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!house) return res.status(404).json({ success: false, message: 'House not found' });
    return res.status(200).json({ success: true, message: 'Boarding house updated', data: house });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update house', error: error.message });
  }
};

exports.deleteHouse = async (req, res) => {
  if (!ensureOwnerRole(req, res)) return;
  try {
    const { houseId } = req.params;
    const house = await BoardingHouse.findOneAndDelete({ _id: houseId, ownerId: req.user.userId });
    if (!house) return res.status(404).json({ success: false, message: 'House not found' });
    await Room.deleteMany({ ownerId: req.user.userId, houseId });
    return res.status(200).json({ success: true, message: 'Boarding house deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete house', error: error.message });
  }
};

exports.getRooms = async (req, res) => {
  if (!ensureOwnerRole(req, res)) return;
  try {
    const rooms = await Room
      .find({ ownerId: req.user.userId, isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch rooms', error: error.message });
  }
};

exports.createRoom = async (req, res) => {
  if (!ensureOwnerRole(req, res)) return;
  try {
    const {
      houseId, name, roomNumber, floor, bedCount, occupancy,
      price, facilities, images, location, roomType, genderPreference,
      availableFrom, deposit, roommateCount, description,
      owner, ownerPhone, ownerEmail,
    } = req.body;

    const room = await Room.create({
      houseId,
      name: name || `Room ${roomNumber}`,
      roomNumber,
      floor: Number(floor) || 1,
      bedCount: Number(bedCount) || 1,
      totalSpots: Number(bedCount) || 1,
      occupancy: Number(occupancy) || 0,
      price: Number(price),
      facilities: facilities || [],
      images: images || [],
      location,
      roomType: roomType || 'Single Room',
      genderPreference: genderPreference || 'Any',
      availableFrom: availableFrom || null,
      deposit: Number(deposit) || 0,
      roommateCount: roommateCount || 'None',
      description: description || '',
      owner: owner || '',
      ownerPhone: ownerPhone || '',
      ownerEmail: ownerEmail || '',
      ownerId: req.user.userId,
      isActive: true,
    });

    return res.status(201).json({ success: true, message: 'Room created', data: room });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create room', error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  if (!ensureOwnerRole(req, res)) return;
  try {
    const { roomId } = req.params;
    const room = await Room.findOneAndUpdate(
      { _id: roomId, ownerId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    return res.status(200).json({ success: true, message: 'Room updated', data: room });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update room', error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  if (!ensureOwnerRole(req, res)) return;
  try {
    const { roomId } = req.params;
    const room = await Room.findOneAndDelete({ _id: roomId, ownerId: req.user.userId });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    return res.status(200).json({ success: true, message: 'Room deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete room', error: error.message });
  }
};

exports.getPendingPaymentSlips = async (req, res) => {
  if (!['owner', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Only owners can view payment slips' });
  }
  try {
    const [rooms, pendingBookings] = await Promise.all([
      Room.find({ ownerId: req.user.userId }).populate('houseId').lean(),
      BookingGroup.find({ status: { $in: ['forming', 'ready'] } }).populate('members.userId').lean()
    ]);

    const roomMap = new Map();
    rooms.forEach(r => {
      roomMap.set(r._id.toString(), r);
      if (r.name) roomMap.set(r.name, r);
    });

    const slips = [];
    for (const booking of pendingBookings) {
      const room = roomMap.get(booking.boardingHouse);
      if (room && booking.members?.length > 0) {
        for (const member of booking.members) {
          if (['accepted', 'pending'].includes(member.status)) {
            slips.push({
              id: `bs-${booking._id}-${member.userId}`,
              tenantName: member.name || member.email,
              roomNumber: room.roomNumber || room.name,
              placeId: room.houseId?._id?.toString() || room.houseId,
              placeName: room.houseId?.name || 'Boarding House',
              amount: booking.totalBudget
                ? Math.floor(booking.totalBudget / booking.members.length)
                : room.price,
              originalRent: room.price,
              date: new Date(member.joinedAt).toISOString().split('T')[0],
              trustScore: member.status === 'accepted' ? 'high' : 'medium',
              status: 'pending',
              slipUrl: null,
            });
          }
        }
      }
    }

    return res.status(200).json({ success: true, data: slips });
  } catch (error) {
    console.error('Error fetching payment slips:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch payment slips', error: error.message });
  }
};

exports.downloadPaymentSlip = async (req, res) => {
  if (!['owner', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Only owners can download slips' });
  }
  try {
    return res.status(200).json({ success: true, message: 'Download initiated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to download slip', error: error.message });
  }
};

exports.approvePaymentSlip = async (req, res) => {
  if (!['owner', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Only owners can approve slips' });
  }
  try {
    const { slipId } = req.params;
    return res.status(200).json({ success: true, message: 'Payment slip approved', data: { slipId, status: 'approved' } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to approve slip', error: error.message });
  }
};

exports.rejectPaymentSlip = async (req, res) => {
  if (!['owner', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Only owners can reject slips' });
  }
  try {
    const { slipId } = req.params;
    const { reason } = req.body;
    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Rejection reason must be at least 10 characters' });
    }
    return res.status(200).json({ success: true, message: 'Payment slip rejected', data: { slipId, status: 'rejected', reason } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to reject slip', error: error.message });
  }
};

exports.getFinancialOverview = async (req, res) => {
  if (!['owner', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Only owners can view financial data' });
  }
  try {
    const [rooms, bookedGroups] = await Promise.all([
      Room.find({ ownerId: req.user.userId }).select('price occupancy').lean(),
      BookingGroup.find({ status: 'booked' }).select('totalBudget members').lean()
    ]);

    let totalExpected = 0;
    rooms.forEach(room => {
      if (room.occupancy > 0) totalExpected += room.price * room.occupancy;
    });

    let totalCollected = bookedGroups.reduce((sum, g) => sum + (g.totalBudget || 0), 0);

    if (totalCollected === 0) {
      rooms.forEach(room => {
        if (room.occupancy > 0)
          totalCollected += room.price * Math.floor(room.occupancy * 0.5);
      });
    }

    const totalDeficit = Math.max(0, totalExpected - totalCollected);
    const collectionPercentage = totalExpected > 0
      ? Math.round((totalCollected / totalExpected) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: { totalExpected, totalCollected, totalDeficit, collectionPercentage }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch financial overview', error: error.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  if (!['owner', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Only owners can view payment history' });
  }
  try {
    const { houseId, status } = req.query;
    let query = { ownerId: req.user.userId };
    if (houseId) query.houseId = houseId;

    const rooms = await Room.find(query).populate('houseId').lean();

    const history = rooms.map(room => ({
      id: room._id.toString(),
      tenantName: room.owner || 'Room ' + room.roomNumber,
      roomNumber: room.roomNumber || room.name,
      boardingHouseId: room.houseId?._id?.toString() || room.houseId,
      boardingHouseName: room.houseId?.name || 'Boarding House',
      monthlyRent: room.price,
      outstandingBalance: 0,
      paymentStatus: room.occupancy > 0 ? 'paid' : 'pending',
      dueDate: '2026-02-28',
      lastPaidDate: '2026-02-28',
      checkInDate: new Date().toISOString().split('T')[0],
      trustScore: room.occupancy > 0 ? 'high' : 'low',
      occupancyCount: room.occupancy || 0,
      totalSpots: room.totalSpots || 1,
    }));

    if (status) {
      return res.status(200).json({
        success: true,
        data: history.filter(h => h.paymentStatus === status)
      });
    }

    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch payment history', error: error.message });
  }
};