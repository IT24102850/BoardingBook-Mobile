const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Roommate Profile Schema
const roommateSchema = new mongoose.Schema({
  name: String,
  description: String,
  budget: Number,
  habits: String,
  gender: String,
  studyPreferences: String,
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roommate' }],
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
});

const Roommate = mongoose.model('Roommate', roommateSchema);

// Create roommate profile
router.post('/profile', async (req, res) => {
  try {
    const roommate = new Roommate(req.body);
    await roommate.save();
    res.status(201).json(roommate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Browse profiles
router.get('/profiles', async (req, res) => {
  try {
    const profiles = await Roommate.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send roommate request
router.post('/request/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { requesterId } = req.body;
    const roommate = await Roommate.findById(id);
    if (!roommate) return res.status(404).json({ error: 'Roommate not found' });
    roommate.requests.push(requesterId);
    await roommate.save();
    res.json(roommate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Accept roommate request
router.post('/accept/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { requesterId } = req.body;
    // Logic to accept request (e.g., add to group)
    res.json({ message: 'Request accepted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
