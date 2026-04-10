const mongoose = require('mongoose');
const env = require('./src/config/env');

async function migrateAndClean() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(env.mongoUri);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('boardinghouses');

    // Step 1: Remove existing indexes (except _id)
    console.log('\n🔧 Removing old indexes...');
    const indexes = await collection.getIndexes();
    for (const indexName in indexes) {
      if (indexName !== '_id_') {
        try {
          await collection.dropIndex(indexName);
          console.log(`  ✓ Dropped index: ${indexName}`);
        } catch (e) {
          console.log(`  ℹ Index ${indexName} doesn't exist`);
        }
      }
    }

    // Step 2: Find and remove duplicates
    console.log('\n🧹 Removing duplicates...');
    const duplicates = await collection.aggregate([
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
      const records = await collection.find({ _id: { $in: ids } })
        .sort({ createdAt: 1 })
        .toArray();

      const keepId = records[0]._id;
      console.log(`\n📍 ${name} (Owner: ${ownerId})`);
      console.log(`   Keeping: ${keepId}`);
      
      for (const record of records.slice(1)) {
        console.log(`   Deleting: ${record._id}`);
        await collection.deleteOne({ _id: record._id });
        totalDeleted++;
      }
    }

    // Step 3: Create new unique index
    console.log('\n\n📌 Creating unique compound index...');
    await collection.createIndex(
      { name: 1, ownerId: 1 },
      { unique: true }
    );
    console.log('✅ Unique compound index created');

    // Step 4: Create index on ownerId for fast queries
    await collection.createIndex({ ownerId: 1 });
    console.log('✅ Index on ownerId created');

    console.log('\n' + '='.repeat(70));
    console.log('✅ MIGRATION COMPLETE');
    console.log('   - Duplicates removed: ' + totalDeleted);
    console.log('   - Unique indexes created');
    console.log('   - Query indexes created');
    console.log('='.repeat(70));

    // Final state
    console.log('\n📊 FINAL DATABASE STATE:');
    const finalCount = await collection.countDocuments({});
    const uniqueGroups = await collection.aggregate([
      {
        $group: {
          _id: { name: '$name', ownerId: '$ownerId' },
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    console.log(`Total records: ${finalCount}`);
    console.log(`Unique (name, owner) combinations: ${uniqueGroups.length}`);

    const finalIndexes = await collection.getIndexes();
    console.log(`\nIndexes created:`);
    Object.keys(finalIndexes).forEach(idx => {
      console.log(`  - ${idx}: ${JSON.stringify(finalIndexes[idx])}`);
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
