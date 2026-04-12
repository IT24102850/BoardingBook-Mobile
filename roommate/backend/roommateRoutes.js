const express = require("express");
const router = express.Router();

// Create roommate profile
router.post("/profile", (req, res) => {
  // TODO: Save roommate profile (description, budget, habits, gender/study preferences)
  res.json({ message: "Profile created/updated" });
});

// Tag boarding house
router.post("/tag-boarding", (req, res) => {
  // TODO: Tag current or planned boarding house
  res.json({ message: "Boarding house tagged" });
});

// Browse profiles
router.get("/profiles", (req, res) => {
  // TODO: Return list of roommate profiles
  res.json([]);
});

// Send/accept roommate requests
router.post("/request", (req, res) => {
  // TODO: Send or accept roommate request
  res.json({ message: "Request sent/accepted" });
});

// Create group, invite, notifications
router.post("/group", (req, res) => {
  // TODO: Create group, invite members
  res.json({ message: "Group created/invites sent" });
});

// Get notifications
router.get("/notifications", (req, res) => {
  // TODO: Return notifications
  res.json([]);
});

module.exports = router;
