const express = require('express');
const mongoose = require('mongoose');
const { generateAgreementPdfDataUri } = require('../utils/agreementPdf');

const router = express.Router();

const bookingStatuses = [
  'requested',
  'rejected',
  'approved',
  'agreement_pending_signatures',
  'signed_ready_for_owner',
  'completed',
];

const memoryBookings = [];

const bookingSchema = new mongoose.Schema(
  {
    bookingType: {
      type: String,
      enum: ['individual', 'group'],
      required: true,
    },
    requesterName: {
      type: String,
      required: true,
      trim: true,
    },
    studentNames: {
      type: [String],
      required: true,
      validate: (value) => Array.isArray(value) && value.length > 0,
    },
    roomDetails: {
      type: String,
      required: true,
      trim: true,
    },
    monthlyRent: {
      type: Number,
      required: true,
      min: 1,
    },
    periodStart: {
      type: String,
      required: true,
    },
    periodEnd: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: bookingStatuses,
      default: 'requested',
    },
    ownerDecisionNote: {
      type: String,
      default: '',
    },
    agreement: {
      agreementId: { type: String },
      generatedAt: { type: String },
      studentSignatures: {
        type: Map,
        of: String,
        default: {},
      },
      ownerConfirmedAt: { type: String },
      pdfDataUri: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

const isMongoReady = (req) => Boolean(req.app?.locals?.mongoReady);

const createMemoryBookingId = () => `BK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const cloneMemoryBooking = (booking) => JSON.parse(JSON.stringify(booking));

const mapMemoryBooking = (booking) => cloneMemoryBooking(booking);

const findMemoryBooking = (id) => memoryBookings.find((booking) => booking.id === id);

const sanitizeStudentNames = (studentNames) => {
  if (!Array.isArray(studentNames)) {
    return [];
  }

  return studentNames
    .map((name) => String(name).trim())
    .filter(Boolean);
};

const mapBooking = (bookingDoc) => {
  const plain = bookingDoc.toObject({ versionKey: false });
  const studentSignatures = plain.agreement?.studentSignatures || {};

  return {
    ...plain,
    id: plain._id.toString(),
    createdAt: plain.createdAt ? new Date(plain.createdAt).toISOString() : new Date().toISOString(),
    agreement: plain.agreement
      ? {
          ...plain.agreement,
          studentSignatures:
            studentSignatures instanceof Map
              ? Object.fromEntries(studentSignatures.entries())
              : studentSignatures,
        }
      : undefined,
    _id: undefined,
  };
};

router.get('/', async (req, res) => {
  try {
    if (!isMongoReady(req)) {
      const sorted = [...memoryBookings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      return res.json(sorted.map(mapMemoryBooking));
    }

    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.json(bookings.map(mapBooking));
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch bookings' });
  }
});

router.post('/request', async (req, res) => {
  try {
    const { bookingType, requesterName, studentNames, roomDetails, monthlyRent, periodStart, periodEnd } = req.body;
    const normalizedStudentNames = sanitizeStudentNames(studentNames);
    const numericRent = Number(monthlyRent);

    if (!requesterName || !String(requesterName).trim()) {
      return res.status(400).json({ error: 'Requester name is required' });
    }

    if (normalizedStudentNames.length === 0) {
      return res.status(400).json({ error: 'At least one student is required' });
    }

    if (bookingType === 'group' && normalizedStudentNames.length < 2) {
      return res.status(400).json({ error: 'Group booking needs at least two students' });
    }

    if (!roomDetails || !String(roomDetails).trim()) {
      return res.status(400).json({ error: 'Room details are required' });
    }

    if (!Number.isFinite(numericRent) || numericRent <= 0) {
      return res.status(400).json({ error: 'Monthly rent must be a valid positive number' });
    }

    if (!isMongoReady(req)) {
      const booking = {
        id: createMemoryBookingId(),
        bookingType: bookingType === 'group' ? 'group' : 'individual',
        requesterName: String(requesterName).trim(),
        studentNames: normalizedStudentNames,
        roomDetails: String(roomDetails).trim(),
        monthlyRent: numericRent,
        periodStart: String(periodStart || '').trim(),
        periodEnd: String(periodEnd || '').trim(),
        status: 'requested',
        ownerDecisionNote: '',
        createdAt: new Date().toISOString(),
      };

      memoryBookings.unshift(booking);
      return res.status(201).json(mapMemoryBooking(booking));
    }

    const booking = await Booking.create({
      bookingType: bookingType === 'group' ? 'group' : 'individual',
      requesterName: String(requesterName).trim(),
      studentNames: normalizedStudentNames,
      roomDetails: String(roomDetails).trim(),
      monthlyRent: numericRent,
      periodStart: String(periodStart || '').trim(),
      periodEnd: String(periodEnd || '').trim(),
      status: 'requested',
    });

    return res.status(201).json(mapBooking(booking));
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Failed to create booking request' });
  }
});

router.patch('/:id/owner-decision', async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, note } = req.body;

    if (decision !== 'approve' && decision !== 'reject') {
      return res.status(400).json({ error: 'Decision must be approve or reject' });
    }

    if (!isMongoReady(req)) {
      const booking = findMemoryBooking(id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.status !== 'requested') {
        return res.status(400).json({ error: 'Only requested bookings can be approved or rejected' });
      }

      booking.status = decision === 'approve' ? 'approved' : 'rejected';
      booking.ownerDecisionNote = note ? String(note).trim() : '';
      return res.json(mapMemoryBooking(booking));
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'requested') {
      return res.status(400).json({ error: 'Only requested bookings can be approved or rejected' });
    }

    booking.status = decision === 'approve' ? 'approved' : 'rejected';
    booking.ownerDecisionNote = note ? String(note).trim() : '';
    await booking.save();

    return res.json(mapBooking(booking));
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Failed to update owner decision' });
  }
});

router.post('/:id/generate-agreement', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isMongoReady(req)) {
      const booking = findMemoryBooking(id);

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.status !== 'approved') {
        return res.status(400).json({ error: 'Agreement can only be generated for approved bookings' });
      }

      booking.status = 'agreement_pending_signatures';
      booking.agreement = {
        agreementId: `AGR-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        studentSignatures: {},
      };

      return res.json(mapMemoryBooking(booking));
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'approved') {
      return res.status(400).json({ error: 'Agreement can only be generated for approved bookings' });
    }

    booking.status = 'agreement_pending_signatures';
    booking.agreement = {
      agreementId: `AGR-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      studentSignatures: {},
      ownerConfirmedAt: undefined,
      pdfDataUri: undefined,
    };

    await booking.save();
    return res.json(mapBooking(booking));
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Failed to generate agreement' });
  }
});

router.post('/:id/student-sign', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName } = req.body;

    if (!studentName || !String(studentName).trim()) {
      return res.status(400).json({ error: 'studentName is required' });
    }

    const normalizedName = String(studentName).trim().toLowerCase();

    if (!isMongoReady(req)) {
      const booking = findMemoryBooking(id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.status !== 'agreement_pending_signatures' || !booking.agreement) {
        return res.status(400).json({ error: 'Booking is not waiting for student signatures' });
      }

      const matchedStudent = booking.studentNames.find(
        (name) => String(name).trim().toLowerCase() === normalizedName,
      );

      if (!matchedStudent) {
        return res.status(400).json({ error: 'Student is not included in this booking' });
      }

      booking.agreement.studentSignatures = booking.agreement.studentSignatures || {};
      booking.agreement.studentSignatures[matchedStudent] = new Date().toISOString();

      const allSigned = booking.studentNames.every((name) => booking.agreement.studentSignatures[name]);
      booking.status = allSigned ? 'signed_ready_for_owner' : 'agreement_pending_signatures';

      return res.json(mapMemoryBooking(booking));
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'agreement_pending_signatures' || !booking.agreement) {
      return res.status(400).json({ error: 'Booking is not waiting for student signatures' });
    }

    const matchedStudent = booking.studentNames.find(
      (name) => String(name).trim().toLowerCase() === normalizedName,
    );

    if (!matchedStudent) {
      return res.status(400).json({ error: 'Student is not included in this booking' });
    }

    const signatures = booking.agreement.studentSignatures || new Map();
    signatures.set(matchedStudent, new Date().toISOString());
    booking.agreement.studentSignatures = signatures;

    const allSigned = booking.studentNames.every((name) => signatures.get(name));
    booking.status = allSigned ? 'signed_ready_for_owner' : 'agreement_pending_signatures';

    await booking.save();
    return res.json(mapBooking(booking));
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Failed to sign agreement' });
  }
});

router.post('/:id/owner-confirm', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isMongoReady(req)) {
      const booking = findMemoryBooking(id);

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.status !== 'signed_ready_for_owner' || !booking.agreement) {
        return res.status(400).json({ error: 'Owner confirmation is allowed only after all students sign' });
      }

      booking.status = 'completed';
      booking.agreement.ownerConfirmedAt = new Date().toISOString();
      booking.agreement.pdfDataUri = generateAgreementPdfDataUri(booking);

      return res.json(mapMemoryBooking(booking));
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'signed_ready_for_owner' || !booking.agreement) {
      return res.status(400).json({ error: 'Owner confirmation is allowed only after all students sign' });
    }

    booking.status = 'completed';
    booking.agreement.ownerConfirmedAt = new Date().toISOString();

    const mappedForPdf = mapBooking(booking);
    booking.agreement.pdfDataUri = generateAgreementPdfDataUri(mappedForPdf);

    await booking.save();
    return res.json(mapBooking(booking));
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Failed to confirm booking' });
  }
});

router.get('/:id/agreement-pdf', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isMongoReady(req)) {
      const booking = findMemoryBooking(id);

      if (!booking || !booking.agreement || !booking.agreement.pdfDataUri) {
        return res.status(404).json({ error: 'Agreement PDF not available' });
      }

      return res.json({ pdfDataUri: booking.agreement.pdfDataUri });
    }

    const booking = await Booking.findById(id);

    if (!booking || !booking.agreement || !booking.agreement.pdfDataUri) {
      return res.status(404).json({ error: 'Agreement PDF not available' });
    }

    return res.json({ pdfDataUri: booking.agreement.pdfDataUri });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Failed to fetch agreement PDF' });
  }
});

module.exports = router;
