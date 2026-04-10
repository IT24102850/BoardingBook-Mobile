const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const User = require('./src/models/User');

async function seedUsers() {
  try {
    // Ensure MongoDB connection
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Create test users
    const testUses = [
      {
        email: 'adeesha@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Adeesha Sankalpa',
        role: 'student',
        isVerified: true,
      },
      {
        email: 'miyuru@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Miyuru Namal',
        role: 'student',
        isVerified: true,
      },
      {
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'John Doe',
        role: 'student',
        isVerified: true,
      },
      {
        email: 'sarah@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Sarah Smith',
        role: 'student',
        isVerified: true,
      },
    ];

    for (const userData of testUses) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        await User.create(userData);
        console.log(`✓ Created user: ${userData.fullName} (${userData.email})`);
      } else {
        console.log(`- User already exists: ${userData.email}`);
      }
    }

    console.log('\nUsers seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
