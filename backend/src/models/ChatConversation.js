const mongoose = require('mongoose');

const chatParticipantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
    },
  },
  { _id: false }
);

const chatConversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['direct', 'group'],
      default: 'direct',
      index: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
      trim: true,
    },
    participants: {
      type: [chatParticipantSchema],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length >= 2;
        },
        message: 'Conversation must have at least two participants',
      },
    },
    directKey: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true,
      index: true,
    },
    groupRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookingGroup',
      default: undefined,
      unique: true,
      sparse: true,
    },
    lastMessage: {
      text: {
        type: String,
        default: '',
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      at: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

chatConversationSchema.index({ 'participants.user': 1, updatedAt: -1 });

module.exports = mongoose.model('ChatConversation', chatConversationSchema);
