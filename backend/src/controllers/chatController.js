const mongoose = require('mongoose');
const BookingGroup = require('../models/BookingGroup');
const ChatConversation = require('../models/ChatConversation');
const ChatMessage = require('../models/ChatMessage');
const RoommateMatch = require('../models/RoommateMatch');
const RoommateProfile = require('../models/RoommateProfile');
const User = require('../models/User');

function toObjectId(value) {
  if (!value || !mongoose.Types.ObjectId.isValid(value)) {
    return null;
  }
  return new mongoose.Types.ObjectId(value);
}

function directKeyFromUsers(userA, userB) {
  return [String(userA), String(userB)].sort().join(':');
}

function mapUser(user) {
  return {
    id: String(user?._id || ''),
    fullName: user?.fullName || '',
    email: user?.email || '',
    avatar: user?.profilePicture || '',
    role: user?.role || 'student',
  };
}

function mapMessage(message, currentUserId) {
  const sender = mapUser(message.sender || {});
  return {
    id: String(message._id),
    conversationId: String(message.conversation),
    sender,
    content: message.content,
    messageType: message.messageType,
    createdAt: message.createdAt,
    mine: String(sender.id) === String(currentUserId),
  };
}

async function mapConversation(conversation, currentUserId) {
  const participants = (conversation.participants || []).map((entry) => ({
    ...mapUser(entry.user),
    lastReadAt: entry.lastReadAt,
    role: entry.role,
  }));

  const counterpart = participants.find((p) => p.id !== String(currentUserId));
  const title =
    conversation.type === 'group'
      ? conversation.name || 'Group Chat'
      : counterpart?.fullName || counterpart?.email || 'Direct Chat';
  const avatar = conversation.type === 'group' ? conversation.avatar : counterpart?.avatar;

  const currentParticipant = (conversation.participants || []).find(
    (entry) => String(entry.user?._id || entry.user) === String(currentUserId)
  );

  const unreadCount = await ChatMessage.countDocuments({
    conversation: conversation._id,
    sender: { $ne: currentUserId },
    createdAt: { $gt: currentParticipant?.lastReadAt || new Date(0) },
  });

  return {
    id: String(conversation._id),
    type: conversation.type,
    name: title,
    avatar: avatar || '',
    participants,
    lastMessage: {
      text: conversation.lastMessage?.text || '',
      at: conversation.lastMessage?.at || conversation.updatedAt,
      senderId: conversation.lastMessage?.sender ? String(conversation.lastMessage.sender) : null,
    },
    unreadCount,
    updatedAt: conversation.updatedAt,
  };
}

async function ensureConversationMember(conversationId, userId) {
  const conversation = await ChatConversation.findOne({
    _id: conversationId,
    'participants.user': userId,
  })
    .populate('participants.user', 'fullName email role')
    .populate('lastMessage.sender', 'fullName email role');

  return conversation;
}

async function getMutualUserIdSet(currentUserId) {
  const myProfile = await RoommateProfile.findOne({ userId: currentUserId }).lean();
  if (!myProfile) {
    // If current user doesn't have a profile, check if anyone liked them by profile
    // This is a fallback for incomplete onboarding
    return new Set();
  }

  // Get all users I liked
  const myLikes = await RoommateMatch.find(
    { userId: currentUserId, action: 'like' },
    'targetProfileId'
  ).lean();
  const likedProfileIds = myLikes.map((m) => m.targetProfileId);

  // Get users who liked my profile
  const likesOnMe = await RoommateMatch.find(
    { targetProfileId: myProfile._id, action: 'like' },
    'userId'
  ).lean();
  const usersWhoLikedMe = new Set(likesOnMe.map((m) => String(m.userId)));

  if (usersWhoLikedMe.size === 0 || likedProfileIds.length === 0) {
    return new Set();
  }

  // Find profiles I liked that also liked me back
  const mutualProfiles = await RoommateProfile.find({
    _id: { $in: likedProfileIds },
    isActive: true,
  })
    .select('userId')
    .lean();

  return new Set(
    mutualProfiles
      .filter((profile) => usersWhoLikedMe.has(String(profile.userId)))
      .map((profile) => String(profile.userId))
  );
}

exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const conversations = await ChatConversation.find({ 'participants.user': currentUserId })
      .populate('participants.user', 'fullName email role')
      .populate('lastMessage.sender', 'fullName email role')
      .sort({ updatedAt: -1 })
      .limit(100);

    const mapped = await Promise.all(conversations.map((conversation) => mapConversation(conversation, currentUserId)));

    res.status(200).json({
      success: true,
      data: mapped,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching conversations', error: error.message });
  }
};

exports.getDirectContacts = async (req, res) => {
  try {
    const currentUserId = String(req.user.userId);
    const search = String(req.query.search || '').trim();
    const limit = Math.min(Number(req.query.limit || 50), 100);

    // Get mutual matches if current user has a profile; otherwise show all users
    const mutualUserIds = await getMutualUserIdSet(currentUserId);
    
    const userFilter = { _id: { $ne: currentUserId } };
    
    // If user has mutual matches, limit to those; otherwise show all users
    if (mutualUserIds.size > 0) {
      userFilter._id = { $in: Array.from(mutualUserIds), $ne: currentUserId };
    }
    
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      userFilter.$or = [{ fullName: regex }, { email: regex }];
    }

    const users = await User.find(userFilter)
      .select('fullName email role')
      .sort({ updatedAt: -1 })
      .limit(limit);

    const directConversations = await ChatConversation.find({
      type: 'direct',
      'participants.user': currentUserId,
    }).select('directKey _id participants');

    const directMap = new Map();
    for (const conversation of directConversations) {
      const other = (conversation.participants || []).find(
        (entry) => String(entry.user) !== currentUserId
      );
      if (other?.user) {
        directMap.set(String(other.user), String(conversation._id));
      }
    }

    const data = users.map((user) => ({
      id: String(user._id),
      fullName: user.fullName || '',
      email: user.email || '',
        avatar: '',
      role: user.role || 'student',
      conversationId: directMap.get(String(user._id)) || null,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching contacts', error: error.message });
  }
};

exports.getOrCreateDirectConversation = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const recipientId = req.body.recipientId;

    console.log('[Chat] Creating direct conversation:', { currentUserId, recipientId });

    if (!recipientId) {
      return res.status(400).json({ success: false, message: 'recipientId is required' });
    }

    // Normalize recipient id to ObjectId-safe string
    const normalizedRecipientId = String(recipientId);
    let recipientObjectId = normalizedRecipientId;
    if (!mongoose.Types.ObjectId.isValid(normalizedRecipientId)) {
      console.log('[Chat] Invalid recipientId format:', recipientId);
      return res.status(400).json({ success: false, message: 'Valid recipientId is required' });
    }

    if (String(normalizedRecipientId) === String(currentUserId)) {
      return res.status(400).json({ success: false, message: 'Cannot create direct chat with yourself' });
    }

    const recipient = await User.findById(recipientObjectId).select('fullName email profilePicture role');
    if (!recipient) {
      console.log('[Chat] Recipient not found:', recipientObjectId);
      return res.status(404).json({ success: false, message: 'Recipient user not found' });
    }

    console.log('[Chat] Found recipient:', recipient.fullName);

    const key = directKeyFromUsers(currentUserId, normalizedRecipientId);
    console.log('[Chat] Direct key:', key);

    let conversation = await ChatConversation.findOne({ directKey: key })
        .populate('participants.user', 'fullName email role')
        .populate('lastMessage.sender', 'fullName email role');

    if (!conversation) {
      console.log('[Chat] Creating new conversation');
      try {
        conversation = await ChatConversation.create({
          type: 'direct',
          directKey: key,
          participants: [{ user: currentUserId }, { user: recipientObjectId }],
        });
      } catch (createError) {
        // Handle duplicate-key race: another request may have created the same direct conversation.
        if (createError && createError.code === 11000) {
          conversation = await ChatConversation.findOne({ directKey: key })
            .populate('participants.user', 'fullName email role')
            .populate('lastMessage.sender', 'fullName email role');
        } else {
          throw createError;
        }
      }

      if (conversation && conversation._id) {
        conversation = await ChatConversation.findById(conversation._id)
          .populate('participants.user', 'fullName email role')
          .populate('lastMessage.sender', 'fullName email role');
      }
      console.log('[Chat] Conversation created:', conversation._id);
    } else {
      console.log('[Chat] Using existing conversation:', conversation._id);
    }

    if (!conversation) {
      return res.status(500).json({ success: false, message: 'Unable to create or load direct conversation' });
    }

    const mapped = await mapConversation(conversation, currentUserId);
    console.log('[Chat] Mapped conversation:', mapped);

    return res.status(200).json({ success: true, data: mapped });
  } catch (error) {
    console.error('[Chat] Error creating direct conversation:', error);
    return res.status(500).json({ success: false, message: 'Error creating direct conversation', error: error.message });
  }
};

exports.getOrCreateGroupConversation = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { groupId, name, participantIds = [] } = req.body;

    if (groupId) {
      if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ success: false, message: 'Invalid groupId' });
      }

      const group = await BookingGroup.findById(groupId);
      if (!group) {
        return res.status(404).json({ success: false, message: 'Group not found' });
      }

      const isMember = group.members.some((member) => String(member.userId) === String(currentUserId));
      if (!isMember) {
        return res.status(403).json({ success: false, message: 'Not authorized for this group chat' });
      }

      let conversation = await ChatConversation.findOne({ groupRef: groupId })
        .populate('participants.user', 'fullName email role')
        .populate('lastMessage.sender', 'fullName email role');

      if (!conversation) {
        // Only include members with status: 'accepted'
        const acceptedUserIds = group.members
          .filter((member) => member.status === 'accepted')
          .map((member) => toObjectId(member.userId))
          .filter(Boolean);

        if (acceptedUserIds.length < 2) {
          return res.status(400).json({ success: false, message: 'At least 2 accepted members required to start group chat' });
        }

        conversation = await ChatConversation.create({
          type: 'group',
          groupRef: group._id,
          name: group.name || 'Group Chat',
          participants: acceptedUserIds.map((id) => ({ user: id })),
        });

        conversation = await ChatConversation.findById(conversation._id)
          .populate('participants.user', 'fullName email role')
          .populate('lastMessage.sender', 'fullName email role');
      }

      const mapped = await mapConversation(conversation, currentUserId);
      return res.status(200).json({ success: true, data: mapped });
    }

    const normalizedParticipantIds = Array.from(
      new Set([String(currentUserId), ...participantIds.map((id) => String(id))])
    ).filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (normalizedParticipantIds.length < 2) {
      return res.status(400).json({ success: false, message: 'At least one additional participant is required' });
    }

    const users = await User.find({ _id: { $in: normalizedParticipantIds } }).select('fullName email role');
    if (users.length !== normalizedParticipantIds.length) {
      return res.status(404).json({ success: false, message: 'One or more participants were not found' });
    }

    const conversation = await ChatConversation.create({
      type: 'group',
      name: name || 'New Group',
      participants: normalizedParticipantIds.map((id) => ({ user: id })),
    });

    const populated = await ChatConversation.findById(conversation._id)
      .populate('participants.user', 'fullName email role')
      .populate('lastMessage.sender', 'fullName email role');

    const mapped = await mapConversation(populated, currentUserId);

    return res.status(201).json({ success: true, data: mapped });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating group conversation', error: error.message });
  }
};

exports.getConversationMessages = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { conversationId } = req.params;
    const limit = Math.min(Number(req.query.limit || 50), 100);

    const conversation = await ensureConversationMember(conversationId, currentUserId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const query = { conversation: conversationId };
    if (req.query.before) {
      const beforeDate = new Date(req.query.before);
      if (!Number.isNaN(beforeDate.getTime())) {
        query.createdAt = { $lt: beforeDate };
      }
    }

    const messages = await ChatMessage.find(query)
      .populate('sender', 'fullName email role')
      .sort({ createdAt: -1 })
      .limit(limit);

    await ChatConversation.updateOne(
      { _id: conversationId, 'participants.user': currentUserId },
      { $set: { 'participants.$.lastReadAt': new Date() } }
    );

    return res.status(200).json({
      success: true,
      data: messages.reverse().map((message) => mapMessage(message, currentUserId)),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching messages', error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { conversationId } = req.params;
    const content = String(req.body.content || '').trim();

    if (!content) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const conversation = await ensureConversationMember(conversationId, currentUserId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const message = await ChatMessage.create({
      conversation: conversationId,
      sender: currentUserId,
      content,
      readBy: [currentUserId],
    });

    const populatedMessage = await ChatMessage.findById(message._id).populate('sender', 'fullName email role');

    await ChatConversation.updateOne(
      { _id: conversationId },
      {
        $set: {
          lastMessage: {
            text: content,
            sender: currentUserId,
            at: populatedMessage.createdAt,
          },
          updatedAt: new Date(),
        },
      }
    );

    const mappedMessage = mapMessage(populatedMessage, currentUserId);

    const io = req.app.locals.io;
    if (io) {
      io.to(`conversation:${conversationId}`).emit('message:new', mappedMessage);
    }

    return res.status(201).json({ success: true, data: mappedMessage });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
  }
};

exports.markConversationRead = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { conversationId } = req.params;

    const conversation = await ensureConversationMember(conversationId, currentUserId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    await ChatConversation.updateOne(
      { _id: conversationId, 'participants.user': currentUserId },
      { $set: { 'participants.$.lastReadAt': new Date() } }
    );

    return res.status(200).json({ success: true, message: 'Conversation marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error marking conversation as read', error: error.message });
  }
};
