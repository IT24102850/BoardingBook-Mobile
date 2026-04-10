const mongoose = require('mongoose');
const env = require('./src/config/env');

async function checkDuplicates() {
  try {
    await mongoose.connect(env.mongoUri);
    const db = mongoose.connection.db;
    
    const houses = await db.collection('boardinghouses').find({}).toArray();
    
    console.log('📊 CURRENT DATABASE STATE:');
    console.log('='.repeat(60));
    console.log('Total records:', houses.length);
    
    const nameGroups = {};
    houses.forEach(h => {
      if (!nameGroups[h.name]) nameGroups[h.name] = [];
      nameGroups[h.name].push({ id: h._id, owner: h.ownerId });
    });
    
    console.log('\n🏠 BOARDING HOUSES BY NAME:');
    console.log('-'.repeat(60));
    Object.entries(nameGroups).forEach(([name, records]) => {
      console.log(`\n[${name}]`);
      console.log(`Count: ${records.length}`);
      records.forEach((r, i) => {
        console.log(`  [${i+1}] ID: ${r.id}`);
        console.log(`      Owner ID: ${r.owner}`);
      });
    });
    
    const duplicates = Object.entries(nameGroups).filter(([_, ids]) => ids.length > 1);
    console.log('\n' + '='.repeat(60));
    if (duplicates.length === 0) {
      console.log('✅ NO DUPLICATES FOUND - All boarding house names are unique!');
    } else {
      console.log('⚠️  DUPLICATES FOUND: ' + duplicates.length + ' boarding house names appear multiple times');
    }
    
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkDuplicates();
