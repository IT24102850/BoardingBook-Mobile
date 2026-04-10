/**
 * @route GET /api/roommates/browse
 * @access Private
 */
const mongoose = require('mongoose');
const User = require('../models/User');
const RoommateProfile = require('../models/RoommateProfile');

exports.browseProfiles = async (req, res) => {
  try {
    const userId = req.user && req.user.userId;

    const currentUserObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : null;

    const browseFilter = { role: 'student' };
    if (currentUserObjectId) {
      browseFilter._id = { $ne: currentUserObjectId };
    }

    const users = await User.find(browseFilter)
      .select('name fullName email role gender academicYear profilePicture tags boardingHouse age dateOfBirth dob birthDate bio description')
      .sort({ createdAt: -1, _id: -1 })
      .limit(500)
      .lean()
      .maxTimeMS(15000)
      .exec();

    const deriveAge = (user) => {
      if (user.age && user.age > 0) return user.age;
      const dobRaw = user.dateOfBirth || user.dob || user.birthDate;
      if (dobRaw) {
        const dob = new Date(dobRaw);
        if (!Number.isNaN(dob.getTime())) {
          const today = new Date();
          let years = today.getFullYear() - dob.getFullYear();
          const monthDelta = today.getMonth() - dob.getMonth();
          const beforeBirthday = monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate());
          if (beforeBirthday) years -= 1;
          if (years > 0) return years;
        }
      }
      return 0;
    };

    const profiles = users
      .filter(Boolean)
      .map((user) => ({
        id: user._id,
        userId: user._id,
        name: user.name || user.fullName || '',
        bio: user.bio || user.description || '',
        profilePicture: user.profilePicture || '',
        gender: user.gender || '',
        university: user.boardingHouse || user.academicYear || '',
        email: user.email || '',
        interests: Array.isArray(user.tags) ? user.tags : [],
        age: deriveAge(user),
        role: user.role || 'student',
        dateOfBirth: user.dateOfBirth || user.dob || user.birthDate || '',
        budget: null,
        preferences: '',
        roomType: '',
        boardingScenario: 'none',
        taggedRoomId: null,
        taggedRoomVacancy: null,
      }));

    res.json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch roommate profiles', error: error.message });
  }
};

/**
 * @desc Create or update roommate profile for current user
 * @route POST /api/roommates/profile
 * @access Private
 */
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('fullName name email');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      description = '',
      budget,
      gender,
      academicYear,
      preferences = '',
      roomType,
      billsIncluded = false,
      availableFrom,
      tags = [],
      boardingHouse = '',
      lookingFor = 'Shared Room',
      boardingScenario = 'none',
      taggedRoomId = null,
      taggedRoomVacancy = null,
    } = req.body;

    const profile = await RoommateProfile.findOneAndUpdate(
      { userId },
      {
        userId,
        name: user.fullName || user.name || user.email,
        email: user.email,
        description,
        budget,
        gender,
        academicYear,
        preferences,
        roomType,
        billsIncluded: Boolean(billsIncluded),
        availableFrom,
        tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
        boardingHouse,
        lookingFor,
        boardingScenario,
        taggedRoomId,
        taggedRoomVacancy,
        isActive: true,
      },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to save roommate profile', error: error.message });
  }
};

/**
 * @desc Get current user's roommate profile
 * @route GET /api/roommates/profile
 * @access Private
 */
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await RoommateProfile.findOne({ userId, isActive: true }).lean();
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Roommate profile not found' });
    }
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch roommate profile', error: error.message });
  }
};

/**
 * @desc Swipe on a profile (like/pass)
 * @route POST /api/roommates/swipe
 * @access Private
 */
exports.swipeProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { profileId, action } = req.body;
    if (!profileId || !['like', 'pass'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid swipe action or profileId' });
    }
    const update =
      action === 'like'
        ? { $addToSet: { liked: profileId } }
        : { $addToSet: { passed: profileId } };
    await User.findByIdAndUpdate(userId, update);
    res.json({ success: true, message: `Profile ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Swipe failed', error: error.message });
  }
};

/**
 * @desc Get liked profiles
 * @route GET /api/roommates/liked
 * @access Private
 */
exports.getLikedProfiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('liked').lean().maxTimeMS(10000);
    const likedIds = Array.isArray(user?.liked) ? user.liked.slice(0, 120) : [];

    if (!likedIds.length) {
      return res.json({ success: true, data: [] });
    }

    const users = await User.find({ _id: { $in: likedIds } })
      .select('name fullName email role gender academicYear profilePicture profilePictures description bio tags boardingHouse age')
      .lean()
      .maxTimeMS(12000);

    const profiles = users
      .filter((u) => String(u?.role || '').toLowerCase() === 'student')
      .map((user) => ({
        id: user._id,
        userId: user._id,
        name: user.name || user.fullName || '',
        bio: user.bio || user.description || '',
        profilePictures: Array.isArray(user.profilePictures) && user.profilePictures.length > 0
          ? user.profilePictures
          : (user.profilePicture ? [user.profilePicture] : []),
        profilePicture: user.profilePicture || '',
        gender: user.gender || '',
        university: user.boardingHouse || user.academicYear || '',
        email: user.email || '',
        interests: Array.isArray(user.tags) ? user.tags : [],
        role: user.role || 'student',
        age: user.age || 0,
      }));

    res.json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch liked profiles', error: error.message });
  }
};

/**
 * @desc Get passed profiles (if you track them)
 * @route GET /api/roommates/passed
 * @access Private
 */
exports.getPassedProfiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const passedIds = user.passed || [];
    const users = await User.find({ _id: { $in: passedIds }, isActive: true })
      .select('name email gender academicYear profilePicture profilePictures description tags boardingHouse');
    const profiles = users.map(user => ({
      id: user._id,
      userId: user._id,
      name: user.name || user.fullName || '',
      bio: user.bio || user.description || '',
      profilePictures: Array.isArray(user.profilePictures) && user.profilePictures.length > 0
        ? user.profilePictures
        : (user.profilePicture ? [user.profilePicture] : []),
      profilePicture: user.profilePicture || '',
      gender: user.gender || '',
      university: user.boardingHouse || user.academicYear || '',
      email: user.email || '',
      interests: Array.isArray(user.tags) ? user.tags : [],
    }));
    res.json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch passed profiles', error: error.message });
  }
};

/**
 * @desc Get mutual matches
 * @route GET /api/roommates/mutual
 * @access Private
 */
exports.getMutualMatches = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Get the current user's liked list
    const user = await User.findById(userId);
    const likedIds = user.liked || [];
    if (!likedIds.length) {
      return res.json({ success: true, data: [] });
    }

    // Find users who:
    // 1. Are in the likedIds list
    // 2. Have liked the current user back
    const mutuals = await User.find({
      _id: { $in: likedIds },
      liked: userId,
      isActive: true
    }).select('name fullName email gender academicYear profilePicture profilePictures description tags boardingHouse');

    const profiles = mutuals.map(user => {
      // Prefer fullName, then name, then email prefix
      let displayName = user.fullName || user.name || '';
      if (!displayName && user.email) {
        displayName = user.email.split('@')[0];
      }
      // Always provide a profile picture
      let profilePic = '';
      if (Array.isArray(user.profilePictures) && user.profilePictures.length > 0) {
        profilePic = user.profilePictures[0];
      } else if (user.profilePicture) {
        profilePic = user.profilePicture;
      } else {
        profilePic = 'https://randomuser.me/api/portraits/lego/1.jpg';
      }
      return {
        id: user._id,
        userId: user._id,
        name: displayName,
        bio: user.bio || user.description || '',
        profilePictures: Array.isArray(user.profilePictures) && user.profilePictures.length > 0
          ? user.profilePictures
          : (user.profilePicture ? [user.profilePicture] : [profilePic]),
        profilePicture: profilePic,
        gender: user.gender || '',
        university: user.boardingHouse || user.academicYear || '',
        email: user.email || '',
        interests: Array.isArray(user.tags) ? user.tags : [],
      };
    });
    res.json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch mutual matches', error: error.message });
  }
};

