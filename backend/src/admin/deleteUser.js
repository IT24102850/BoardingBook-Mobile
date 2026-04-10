/**
 * DEV ONLY — Delete a user by email for testing purposes.
 * Usage: node src/admin/deleteUser.js email@example.com
 * Remove this file before production.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const email = process.argv[2];

if (!email) {
  console.error('Usage: node src/admin/deleteUser.js <email>');
  process.exit(1);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await User.deleteOne({ email: email.toLowerCase() });
  if (result.deletedCount === 0) {
    console.log(`No user found with email: ${email}`);
  } else {
    console.log(`Deleted user: ${email}`);
  }
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
