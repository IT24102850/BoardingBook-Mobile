
const mongoose = require('mongoose');
const BookingRequest = require('../models/BookingRequest');
const BookingAgreement = require('../models/BookingAgreement');
const Room = require('../models/Room');
const Notification = require('../models/Notification');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function isOwnerOrAdmin(user) {
  return user && ['owner', 'admin'].includes(user.role);
}

function isStudent(user) {
  return user && user.role === 'student';
}

exports.createBookingRequest = async (req, res) => {
  try {
    if (!isStudent(req.user)) {
      return res.status(403).json({ success: false, message: 'Only students can submit booking requests' });
    }

    const {
      roomId,
      bookingType = 'individual',
      groupId = null,
      groupSize = 1,
      moveInDate,
      durationMonths = 6,
      message = '',
      mutualFriendIds = [],
    } = req.body;

    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ success: false, message: 'Valid roomId is required' });
    }

    if (!moveInDate) {
      return res.status(400).json({ success: false, message: 'moveInDate is required' });
    }

    const room = await Room.findById(roomId);
    if (!room || !room.ownerId) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    let group = null;
    if (bookingType === 'group') {
      // If groupId is not provided, create a new group with mutual friends
      if (!groupId) {
        const BookingGroup = require('../models/BookingGroup');
        const User = require('../models/User');
        const creator = await User.findById(req.user.userId);
        const users = await User.find({ _id: { $in: mutualFriendIds } });
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
          })),
        ];
        group = new BookingGroup({
          name: `Group-${new Date().getTime()}`,
          creatorId: creator._id,
          members,
          status: 'forming',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await group.save();
      } else {
        const BookingGroup = require('../models/BookingGroup');
        group = await BookingGroup.findById(groupId);
      }
    }

    const request = await BookingRequest.create({
      studentId: req.user.userId,
      ownerId: room.ownerId,
      roomId: room._id,
      bookingType: bookingType === 'group' ? 'group' : 'individual',
      groupName: '',
      groupSize: bookingType === 'group' ? Math.max(1, Number(groupSize) || 1) : 1,
      groupId: group ? group._id : null,
      moveInDate,
      durationMonths: Math.max(1, Number(durationMonths) || 6),
      message,
      status: 'pending',
    });

    const hydrated = await BookingRequest.findById(request._id)
      .populate('roomId', 'name roomNumber price location')
      .populate('studentId', 'fullName email phoneNumber mobileNumber')
      .lean();

    return res.status(201).json({
      success: true,
      message: 'Booking request submitted',
      data: hydrated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit booking request', error: error.message });
  }
};

exports.getMyBookingRequests = async (req, res) => {
  try {
    if (!isStudent(req.user)) {
      return res.status(403).json({ success: false, message: 'Only students can view these requests' });
    }

    const requests = await BookingRequest.find({ studentId: req.user.userId })
      .populate('roomId', 'name roomNumber price location owner ownerPhone ownerEmail')
      .populate('ownerId', 'fullName email phoneNumber mobileNumber')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch booking requests', error: error.message });
  }
};

exports.getOwnerBookingRequests = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req.user)) {
      return res.status(403).json({ success: false, message: 'Only owners can view booking requests' });
    }

    const { status } = req.query;
    const filter = { ownerId: req.user.userId };
    if (status && ['pending', 'approved', 'rejected'].includes(String(status))) {
      filter.status = String(status);
    }

    const requests = await BookingRequest.find(filter)
      .populate('roomId', 'name roomNumber price location')
      .populate('studentId', 'fullName email phoneNumber mobileNumber')
      .populate('agreementId', 'title status sentAt')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch owner booking requests', error: error.message });
  }
};

exports.updateBookingRequestStatus = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req.user)) {
      return res.status(403).json({ success: false, message: 'Only owners can update booking requests' });
    }

    const { requestId } = req.params;
    const { status, rejectionReason = '' } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: 'Invalid request id' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'status must be approved or rejected' });
    }

    if (status === 'rejected' && String(rejectionReason).trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Rejection reason must be at least 5 characters' });
    }

    const request = await BookingRequest.findOne({ _id: requestId, ownerId: req.user.userId });
    if (!request) {
      return res.status(404).json({ success: false, message: 'Booking request not found' });
    }

    request.status = status;
    request.processedAt = new Date();
    request.processedBy = req.user.userId;
    request.rejectionReason = status === 'rejected' ? String(rejectionReason).trim() : '';
    await request.save();

    const hydrated = await BookingRequest.findById(request._id)
      .populate('roomId', 'name roomNumber price location')
      .populate('studentId', 'fullName email phoneNumber mobileNumber')
      .populate('agreementId', 'title status sentAt')
      .lean();

    return res.status(200).json({
      success: true,
      message: `Booking request ${status}`,
      data: hydrated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update booking request status', error: error.message });
  }
};

exports.createAgreementForRequest = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req.user)) {
      return res.status(403).json({ success: false, message: 'Only owners can create agreements' });
    }

    const {
      bookingRequestId,
      title,
      terms,
      rentAmount,
      depositAmount = 0,
      periodStart,
      periodEnd,
      additionalClauses = [],
    } = req.body;

    if (!bookingRequestId || !mongoose.Types.ObjectId.isValid(bookingRequestId)) {
      return res.status(400).json({ success: false, message: 'Valid bookingRequestId is required' });
    }

    const request = await BookingRequest.findOne({ _id: bookingRequestId, ownerId: req.user.userId });
    if (!request) {
      return res.status(404).json({ success: false, message: 'Booking request not found' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Only approved requests can receive agreements' });
    }

    const alreadyExists = await BookingAgreement.findOne({ bookingRequestId: request._id });
    if (alreadyExists) {
      return res.status(409).json({ success: false, message: 'Agreement already sent for this request' });
    }

    const agreement = await BookingAgreement.create({
      ownerId: req.user.userId,
      studentId: request.studentId,
      roomId: request.roomId,
      bookingRequestId: request._id,
      title,
      terms,
      rentAmount: Number(rentAmount) || 0,
      depositAmount: Number(depositAmount) || 0,
      periodStart,
      periodEnd,
      additionalClauses: Array.isArray(additionalClauses)
        ? additionalClauses.filter((item) => String(item || '').trim().length > 0)
        : [],
      status: 'sent',
      sentAt: new Date(),
    });

    request.agreementId = agreement._id;
    await request.save();

    const hydrated = await BookingAgreement.findById(agreement._id)
      .populate('bookingRequestId', 'status moveInDate durationMonths bookingType groupName groupSize')
      .populate('studentId', 'fullName email phoneNumber mobileNumber')
      .populate('roomId', 'name roomNumber price location')
      .lean();

    // Send notification to student
    await Notification.create({
      user: agreement.studentId,
      type: 'system',
      title: 'New Agreement Sent',
      message: `A digital rental agreement has been sent to you for room: ${hydrated.roomId?.name || ''}. Please review and sign to proceed with your booking.`,
      data: { agreementId: agreement._id, bookingRequestId: agreement.bookingRequestId },
    });

    return res.status(201).json({
      success: true,
      message: 'Agreement created and sent',
      data: hydrated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create agreement', error: error.message });
  }
};

exports.getOwnerAgreements = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req.user)) {
      return res.status(403).json({ success: false, message: 'Only owners can view agreements' });
    }

    const { status } = req.query;
    const filter = { ownerId: req.user.userId };
    if (status && ['sent', 'accepted', 'rejected'].includes(String(status))) {
      filter.status = String(status);
    }

    const agreements = await BookingAgreement.find(filter)
      .populate('bookingRequestId', 'status moveInDate durationMonths bookingType groupName groupSize')
      .populate('studentId', 'fullName email phoneNumber mobileNumber')
      .populate('roomId', 'name roomNumber price location')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, data: agreements });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch agreements', error: error.message });
  }
};

exports.getMyAgreements = async (req, res) => {
  try {
    if (!isStudent(req.user)) {
      return res.status(403).json({ success: false, message: 'Only students can view agreements' });
    }

    const agreements = await BookingAgreement.find({ studentId: req.user.userId })
      .populate('bookingRequestId', 'status moveInDate durationMonths bookingType groupName groupSize')
      .populate('ownerId', 'fullName email phoneNumber mobileNumber')
      .populate('roomId', 'name roomNumber price location')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, data: agreements });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch agreements', error: error.message });
  }
};

exports.respondToAgreement = async (req, res) => {
  try {
    if (!isStudent(req.user)) {
      return res.status(403).json({ success: false, message: 'Only students can respond to agreements' });
    }

    const { agreementId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(agreementId)) {
      return res.status(400).json({ success: false, message: 'Invalid agreement id' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'status must be accepted or rejected' });
    }

    const agreement = await BookingAgreement.findOne({ _id: agreementId, studentId: req.user.userId });
    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }

    agreement.status = status;
    agreement.acceptedAt = status === 'accepted' ? new Date() : null;
    agreement.rejectedAt = status === 'rejected' ? new Date() : null;
    await agreement.save();

    let pdfUrl = null;
    if (status === 'accepted') {
      // Generate PDF
      const pdfDir = path.join(__dirname, '../../public/agreements');
      if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
      const pdfPath = path.join(pdfDir, `agreement_${agreement._id}.pdf`);
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(pdfPath));
      doc.fontSize(20).text('Boarding House Rental Agreement', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Agreement ID: ${agreement._id}`);
      doc.text(`Room: ${agreement.roomId}`);
      doc.text(`Student: ${req.user.userId}`);
      doc.text(`Owner: ${agreement.ownerId}`);
      doc.text(`Period: ${agreement.periodStart?.toISOString().slice(0,10)} to ${agreement.periodEnd?.toISOString().slice(0,10)}`);
      doc.moveDown();
      doc.text('Terms:');
      doc.text(agreement.terms);
      if (agreement.additionalClauses && agreement.additionalClauses.length > 0) {
        doc.moveDown();
        doc.text('Additional Clauses:');
        agreement.additionalClauses.forEach((clause, idx) => {
          doc.text(`${idx + 1}. ${clause}`);
        });
      }
      doc.end();
      pdfUrl = `/agreements/agreement_${agreement._id}.pdf`;
    }

    const hydrated = await BookingAgreement.findById(agreement._id)
      .populate('bookingRequestId', 'status moveInDate durationMonths bookingType groupName groupSize')
      .populate('ownerId', 'fullName email phoneNumber mobileNumber')
      .populate('roomId', 'name roomNumber price location')
      .lean();

    // Notify owner and student on sign
    if (status === 'accepted') {
      await Notification.create({
        user: agreement.ownerId,
        type: 'system',
        title: 'Agreement Signed',
        message: `The student has signed the agreement for room: ${hydrated.roomId?.name || ''}.`,
        data: { agreementId: agreement._id, bookingRequestId: agreement.bookingRequestId, pdfUrl },
      });
      await Notification.create({
        user: agreement.studentId,
        type: 'system',
        title: 'Agreement Signed',
        message: `You have signed the agreement. Download your PDF here.`,
        data: { agreementId: agreement._id, bookingRequestId: agreement.bookingRequestId, pdfUrl },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Agreement ${status}`,
      data: { ...hydrated, pdfUrl },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to respond to agreement', error: error.message });
  }
};
