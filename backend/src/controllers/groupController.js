
/**
 * Group Controller - Placeholder for future group functionality
 */



const BookingGroup = require('../models/BookingGroup');
const RoommateProfile = require('../models/RoommateProfile');
const User = require('../models/User');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');


exports.createGroup = async (req, res) => {
  try {
    const userId = req.user && req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }


    const {
      memberEmails,
      scenario = 'new-place',
      roomId = null,
      plannedBoardingHouseTag = 'Planned boarding house',
      currentBoardingHouseTag = '',
    } = req.body;
    if (!Array.isArray(memberEmails) || memberEmails.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one member email is required' });
    }

    // Find users by email, exclude duplicates and the creator
    const users = await User.find({ email: { $in: memberEmails, $ne: req.user.email } });
    // Always include the creator as a member (status: accepted)
    const creator = await User.findById(userId);
    if (!creator) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }

    // Build members array
    const members = [
      {
        userId: creator._id,
        email: creator.email,
        name: creator.fullName || creator.name || creator.email,
        status: 'accepted',
        joinedAt: new Date(),
      },
      ...users.map(u => ({
        userId: u._id,
        email: u.email,
        name: u.fullName || u.name || u.email,
        status: 'pending',
        joinedAt: null,
      }))
    ];

    // Create group
    // Generate a unique group ID (MongoDB _id)
    const validRoomId = roomId && mongoose.Types.ObjectId.isValid(roomId) ? roomId : null;
    const group = new BookingGroup({
      name: `Group-${new Date().getTime()}`,
      creatorId: creator._id,
      members,
      scenario: scenario === 'join-existing' ? 'join-existing' : 'new-place',
      roomId: scenario === 'join-existing' ? validRoomId : null,
      currentBoardingHouseTag:
        scenario === 'join-existing'
          ? (currentBoardingHouseTag || 'Current boarding house (1 vacancy left)')
          : '',
      plannedBoardingHouseTag:
        scenario === 'new-place'
          ? (plannedBoardingHouseTag || 'Planned boarding house')
          : '',
      status: 'forming',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await group.save();

    if (users.length > 0) {
      await Notification.insertMany(
        users.map((u) => ({
          user: u._id,
          type: 'group_invite',
          title: 'Group invitation',
          message: `${creator.fullName || creator.name || creator.email} invited you to a booking group.`,
          data: { groupId: group._id, scenario: group.scenario, roomId: group.roomId || null },
          read: false,
        }))
      );
    }

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: { groupId: group._id, ...group.toObject() },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create group', error: error.message });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user && req.user.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const objectUserId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : null;

    if (!objectUserId) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    // Use two index-friendly queries instead of one $or query, then merge and sort.
    const baseSelect = 'name creatorId members scenario roomId currentBoardingHouseTag plannedBoardingHouseTag status createdAt updatedAt';
    const [creatorGroups, memberGroups] = await Promise.all([
      BookingGroup.find({ creatorId: objectUserId })
        .select(baseSelect)
        .sort({ updatedAt: -1 })
        .limit(50)
        .lean()
        .maxTimeMS(8000),
      BookingGroup.find({ 'members.userId': objectUserId })
        .select(baseSelect)
        .sort({ updatedAt: -1 })
        .limit(50)
        .lean()
        .maxTimeMS(8000),
    ]);

    const merged = new Map();
    [...creatorGroups, ...memberGroups].forEach((group) => {
      merged.set(String(group._id), group);
    });

    const groups = Array.from(merged.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 50);

    res.json({
      success: true,
      data: groups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch groups',
      error: error.message,
    });
  }
};

exports.getGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;
    const group = await BookingGroup.findById(groupId)
      .populate('members.userId', 'fullName name email profilePicture')
      .populate('roomId', 'name location totalSpots occupancy')
      .lean();
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    const isMember =
      String(group.creatorId) === String(userId) ||
      (Array.isArray(group.members) && group.members.some((m) => String(m.userId?._id || m.userId) === String(userId)));
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Not allowed to view this group' });
    }
    return res.json({ success: true, data: group });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch group', error: error.message });
  }
};

exports.addGroupMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberEmail } = req.body;
    const userId = req.user.userId;
    const group = await BookingGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    if (String(group.creatorId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Only group creator can add members' });
    }
    const user = await User.findOne({ email: memberEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (group.members.some((m) => String(m.userId) === String(user._id))) {
      return res.status(400).json({ success: false, message: 'User already in this group' });
    }
    group.members.push({
      userId: user._id,
      email: user.email,
      name: user.fullName || user.name || user.email,
      status: 'pending',
      joinedAt: null,
    });
    await group.save();
    await Notification.create({
      user: user._id,
      type: 'group_invite',
      title: 'Group invitation',
      message: 'You were invited to join a booking group.',
      data: { groupId: group._id, scenario: group.scenario, roomId: group.roomId || null },
      read: false,
    });
    return res.json({ success: true, message: 'Member invited', data: group });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add member', error: error.message });
  }
};

exports.removeGroupMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const userId = req.user.userId;
    const group = await BookingGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    if (String(group.creatorId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Only group creator can remove members' });
    }
    group.members = group.members.filter((m) => String(m.userId) !== String(memberId));
    await group.save();
    return res.json({ success: true, message: 'Member removed', data: group });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to remove member', error: error.message });
  }
};

exports.respondToGroupInvite = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;
    const group = await BookingGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    const member = group.members.find((m) => String(m.userId) === String(userId));
    if (!member) {
      return res.status(403).json({ success: false, message: 'You are not part of this group' });
    }
    member.status = status;
    member.joinedAt = status === 'accepted' ? new Date() : member.joinedAt;
    await group.save();

    await Notification.create({
      user: group.creatorId,
      type: status === 'accepted' ? 'group_invite_accepted' : 'group_invite_rejected',
      title: status === 'accepted' ? 'Invite accepted' : 'Invite rejected',
      message: `${member.name || member.email || 'A member'} has ${status} your group invite.`,
      data: { groupId: group._id, memberId: userId },
      read: false,
    });

    return res.json({ success: true, message: `Invite ${status}`, data: group });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to respond to invite', error: error.message });
  }
};

/**
 * @desc Update group status (forming -> ready -> booked)
 * @route PATCH /api/roommates/group/:groupId/status
 * @access Private
 */
exports.updateGroupStatus = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;
    const { status } = req.body; // 'forming', 'ready', 'booked'

    if (!['forming', 'ready', 'booked'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'status must be "forming", "ready", or "booked"',
      });
    }

    const group = await BookingGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Verify user is group creator
    if (group.creatorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only group creator can change status',
      });
    }

    group.status = status;
    await group.save();

    const membersToNotify = Array.isArray(group.members)
      ? group.members.filter((m) => String(m.userId) !== String(group.creatorId)).map((m) => m.userId)
      : [];

    if (membersToNotify.length > 0) {
      await Notification.insertMany(
        membersToNotify.map((memberUserId) => ({
          user: memberUserId,
          type: 'system',
          title: 'Group status updated',
          message: `Your group status changed to ${status}.`,
          data: { groupId: group._id, status },
          read: false,
        }))
      );
    }

    res.status(200).json({
      success: true,
      message: 'Group status updated',
      data: group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating group status',
      error: error.message,
    });
  }

};
