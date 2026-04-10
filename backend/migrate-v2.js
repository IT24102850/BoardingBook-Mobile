const mongoose = require('mongoose');
const env = require('./src/config/env');

async function migrateAndClean() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(env.mongoUri);
    console.log('✅ Connected to MongoDB');

    const BoardingHouse = require('./src/models/BoardingHouse');

    // Step 1: Find duplicates
    console.log('\n🧹 Removing duplicates...');
    const duplicates = await BoardingHouse.collection.aggregate([
      {
        $group: {
          _id: { name: '$name', ownerId: '$ownerId' },
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();

    let totalDeleted = 0;
    console.log(`Found ${duplicates.length} duplicate groups\n`);

    for (const dup of duplicates) {
      const { name, ownerId } = dup._id;
      const ids = dup.ids;

      // Get records sorted by creation time
      const records = await BoardingHouse.find({ _id: { $in: ids } })
        .sort({ createdAt: 1 })
        .lean();

      const keepId = records[0]._id;
      console.log(`\n📍 ${name} (Owner: ${ownerId})`);
      console.log(`   Keeping: ${keepId}`);
      
      for (const record of records.slice(1)) {
        console.log(`   Deleting: ${record._id}`);
        await BoardingHouse.deleteOne({ _id: record._id });
        totalDeleted++;
      }
    }

    // Step 2: Drop and recreate indexes
    console.log('\n\n📌 Setting up indexes...');
    await BoardingHouse.collection.dropIndex('name_1_ownerId_1').catch(() => {});
    await BoardingHouse.collection.dropIndex('ownerId_1').catch(() => {});
    
    // Create new indexes
    await BoardingHouse.collection.createIndex(
      { name: 1, ownerId: 1 },
      { unique: true }
    );
    console.log('✅ Unique compound index created: (name, ownerId)');

    await BoardingHouse.collection.createIndex({ ownerId: 1 });
    console.log('✅ Query index created on ownerId');

    console.log('\n' + '='.repeat(70));
    console.log('✅ MIGRATION COMPLETE');
    console.log('   - Duplicates removed: ' + totalDeleted);
    console.log('   - Unique compound index: (name, ownerId)');
    console.log('   - Query index on ownerId');
    console.log('='.repeat(70));

    // Final state
    console.log('\n📊 FINAL DATABASE STATE:');
    const finalCount = await BoardingHouse.countDocuments();
    const uniqueGroups = await BoardingHouse.collection.aggregate([
      {
        $group: {
          _id: { name: '$name', ownerId: '$ownerId' },
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    console.log(`Total records: ${finalCount}`);
    console.log(`Unique (name, owner) combinations: ${uniqueGroups.length}`);

    const allHouses = await BoardingHouse.find().lean();
    console.log(`\n📋 REMAINING BOARDING HOUSES:`);
    allHouses.forEach((h, i) => {
      console.log(`   ${i+1}. ${h.name} (Owner: ${h.ownerId})`);
    });

    await mongoose.connection.close();
    console.log('\n✓ Migration finished successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

migrateAndClean();
