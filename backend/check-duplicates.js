const mongoose = require('mongoose');
const env = require('./src/config/env');
const BoardingHouse = require('./src/models/BoardingHouse');

mongoose.connect(env.mongoUri)
  .then(async () => {
    console.log('📋 Checking Boarding Houses for Owner: 69c619922f17b48d6c7ea8f2\n');
    
    const houses = await BoardingHouse.find({ ownerId: '69c619922f17b48d6c7ea8f2' }).select('_id name address');
    
    console.log(`Found ${houses.length} records:\n`);
    houses.forEach((h, i) => {
      console.log(`  [${i + 1}] ${h.name}`);
      console.log(`      Address: ${h.address}`);
      console.log(`      ID: ${h._id}\n`);
    });

    // Check for duplicate names
    const nameCount = {};
    houses.forEach(h => {
      nameCount[h.name] = (nameCount[h.name] || 0) + 1;
    });

    const duplicateNames = Object.entries(nameCount).filter(([_, count]) => count > 1);
    if (duplicateNames.length > 0) {
      console.log('⚠️  DUPLICATE NAMES FOUND:');
      duplicateNames.forEach(([name, count]) => {
        console.log(`   "${name}" appears ${count} times`);
      });
    } else {
      console.log('✓ All names are unique');
    }

    process.exit(0);
  })
  .catch(e => { console.error('Error:', e.message); process.exit(1); });
