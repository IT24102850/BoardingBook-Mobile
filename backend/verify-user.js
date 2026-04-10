const mongoose = require('mongoose');
const env = require('./src/config/env');
const User = require('./src/models/User');

async function verifyUser(email) {
  try {
    await mongoose.connect(env.mongoUri);
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isVerified: true },
      { new: true }
    );
    if (user) {
      console.log('User verified:', user.email);
    } else {
      console.log('User not found');
    }
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyUser(process.argv[2] || 'test@my.sliit.lk');
