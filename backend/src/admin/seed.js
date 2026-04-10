/**
 * Run once to create the initial super admin account.
 * Usage: node src/admin/seed.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const existing = await Admin.findOne({ email: 'admin@boardingbook.com' });
  if (existing) {
    console.log('Admin already exists — skipping.');
    process.exit(0);
  }

  await Admin.create({
    name: 'Super Admin',
    email: 'admin@boardingbook.com',
    password: 'Admin@1234',
  });

  console.log('Admin account created:');
  console.log('  Email:    admin@boardingbook.com');
  console.log('  Password: Admin@1234');
  console.log('Change the password after first login!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
