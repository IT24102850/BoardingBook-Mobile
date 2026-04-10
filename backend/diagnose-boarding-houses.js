/**
 * DIAGNOSTIC SCRIPT: Check Boarding Houses in Database
 * RUN THIS TO DEBUG THE OWNER ID ISSUE
 * 
 * Usage: node diagnose-boarding-houses.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const env = require('./src/config/env');
const BoardingHouse = require('./src/models/BoardingHouse');
const User = require('./src/models/User');

async function diagnose() {
  try {
    // Connect to database
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(env.mongoUri);
    console.log('✅ Connected!\n');

    // Get all boarding houses
    console.log('📋 ALL BOARDING HOUSES IN DATABASE:');
    console.log('═'.repeat(80));
    
    const allHouses = await BoardingHouse.find().populate('ownerId', 'email name');
    
    if (allHouses.length === 0) {
      console.log('❌ NO BOARDING HOUSES FOUND IN DATABASE\n');
    } else {
      allHouses.forEach((house, index) => {
        console.log(`\n[${index + 1}] ${house.name}`);
        console.log(`    Address: ${house.address}`);
        console.log(`    ownerId: ${house.ownerId._id}`);
        console.log(`    Owner Email: ${house.ownerId.email}`);
        console.log(`    Owner Name: ${house.ownerId.name}`);
        console.log(`    Status: ${house.status}`);
      });
    }

    console.log('\n' + '═'.repeat(80));
    console.log('\n📌 ALL USERS IN DATABASE:');
    console.log('═'.repeat(80));
    
    const allUsers = await User.find().select('_id email name role');
    
    allUsers.forEach((user, index) => {
      console.log(`\n[${index + 1}] ${user.name}`);
      console.log(`    userId: ${user._id}`);
      console.log(`    Email: ${user.email}`);
      console.log(`    Role: ${user.role}`);
    });

    console.log('\n' + '═'.repeat(80));
    console.log('\n✨ DIAGNOSIS COMPLETE');
    console.log('\n📝 NEXT STEPS:');
    console.log('1. Verify your user ID matches the ownerId in boarding houses');
    console.log('2. Make sure your JWT token contains the correct userId');
    console.log('3. Use the userId from above when testing the API\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

diagnose();
