/**
 * Reset a user's password by email.
 * Usage: node src/admin/resetPassword.js <email> <newPassword>
 *
 * Example:
 *   node src/admin/resetPassword.js IT21234567@my.sliit.lk Test@1234
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const [,, email, newPassword] = process.argv;

if (!email || !newPassword) {
  console.error('Usage: node src/admin/resetPassword.js <email> <newPassword>');
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    console.error(`No user found with email: ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  user.password = newPassword;          // pre-save hook hashes it
  user.isVerified = true;               // ensure they can sign in
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  console.log(`✓ Password reset for ${user.email} (role: ${user.role})`);
  await mongoose.disconnect();
})();
