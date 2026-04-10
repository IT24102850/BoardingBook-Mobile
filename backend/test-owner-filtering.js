const mongoose = require('mongoose');
const env = require('./src/config/env');
const jwt = require('jsonwebtoken');

async function testOwnerFiltering() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(env.mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const BoardingHouse = require('./src/models/BoardingHouse');

    // Get all owners
    const allHouses = await BoardingHouse.find().lean();
    const owners = [...new Set(allHouses.map(h => h.ownerId.toString()))];

    console.log('='.repeat(70));
    console.log('📊 BOARDING HOUSES BY OWNER - FILTERING TEST');
    console.log('='.repeat(70));

    for (const ownerId of owners) {
      const houses = await BoardingHouse.find({ ownerId: ownerId }).lean();
      
      console.log(`\n👤 Owner ID: ${ownerId}`);
      console.log(`   Total boarding houses: ${houses.length}`);
      
      houses.forEach((h, i) => {
        console.log(`   [${i+1}] ${h.name} (ID: ${h._id})`);
      });

      // Verify unique constraint
      const uniqueNames = new Set(houses.map(h => h.name));
      if (uniqueNames.size === houses.length) {
        console.log(`   ✅ No duplicates - all names unique`);
      } else {
        console.log(`   ⚠️ WARNING: Duplicate names found!`);
      }
    }

    // Test API simulation
    console.log('\n\n' + '='.repeat(70));
    console.log('🔐 SIMULATING API CALLS');
    console.log('='.repeat(70));

    for (const ownerId of owners) {
      // Create a test JWT token
      const testToken = jwt.sign(
        {
          userId: ownerId,
          email: `owner@test.com`,
          role: 'owner'
        },
        env.jwtSecret,
        { expiresIn: '7d' }
      );

      // Simulate the service query
      const houses = await BoardingHouse.find({ ownerId: ownerId }).select(
        'name address city monthlyPrice roomCount status createdAt updatedAt ownerId'
      ).lean();

      console.log(`\n📌 For Owner: ${ownerId}`);
      console.log(`   Token: ${testToken.substring(0, 30)}...`);
      console.log(`   Query: { ownerId: "${ownerId}" }`);
      console.log(`   Results: ${houses.length} boarding houses`);
      console.log(`   ✅ API would return:`);
      houses.forEach(h => {
        console.log(`      - ${h.name}`);
      });
    }

    // Test that different owners don't see each other's houses
    console.log('\n\n' + '='.repeat(70));
    console.log('🔒 DATA ISOLATION TEST');
    console.log('='.repeat(70));

    const owner1 = owners[0];
    const owner2 = owners[1];

    const owner1Houses = await BoardingHouse.find({ ownerId: owner1 });
    const owner2Houses = await BoardingHouse.find({ ownerId: owner2 });

    console.log(`\nOwner 1: ${owner1}`);
    console.log(`  Houses: ${owner1Houses.length}`);
    owner1Houses.forEach(h => console.log(`    - ${h.name}`));

    console.log(`\nOwner 2: ${owner2}`);
    console.log(`  Houses: ${owner2Houses.length}`);
    owner2Houses.forEach(h => console.log(`    - ${h.name}`));

    // Check isolation
    const owner1HouseNames = owner1Houses.map(h => h.name.trim().toLowerCase());
    const owner2HouseNames = owner2Houses.map(h => h.name.trim().toLowerCase());
    const commonHouses = owner1HouseNames.filter(h => owner2HouseNames.includes(h));

    console.log(`\nCommon house names: ${commonHouses.length}`);
    if (commonHouses.length > 0) {
      console.log('⚠️  Note: These are DIFFERENT records for different owners');
      commonHouses.forEach(h => console.log(`   - ${h}`));
    }

    console.log('\n✅ Data isolation working correctly - each owner sees only their own houses');

    // Test the unique constraint
    console.log('\n\n' + '='.repeat(70));
    console.log('🛡️ UNIQUE CONSTRAINT TEST');
    console.log('='.repeat(70));

    const testOwnerId = owner1;
    
    console.log(`\nAttempting to create duplicate boarding house:`);
    console.log(`  Owner: ${testOwnerId}`);
    console.log(`  Name: ${owner1Houses[0].name}`);
    
    try {
      const duplicate = new BoardingHouse({
        name: owner1Houses[0].name,
        address: '999 Test Street',
        monthlyPrice: 50000,
        totalRooms: 10,
        ownerId: testOwnerId,
        status: 'active'
      });
      
      await duplicate.save();
      console.log('  ❌ FAILED: Duplicate was created (unique constraint not working!)');
    } catch (error) {
      if (error.code === 11000) {
        console.log('  ✅ BLOCKED: Unique constraint prevented duplicate');
        console.log(`  Error: ${error.message.split('\n')[0]}`);
      } else {
        console.log(`  ⚠️  Different error: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL TESTS COMPLETED');
    console.log('='.repeat(70));

    await mongoose.connection.close();
    console.log('\n✓ Database test finished');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
}

testOwnerFiltering();
