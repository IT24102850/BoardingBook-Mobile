const mongoose = require('mongoose');
const env = require('./src/config/env');

async function removeDuplicates() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(env.mongoUri);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('boardinghouses');

    // Step 1: Find all duplicates by (name, ownerId)
    console.log('\n📊 Analyzing duplicates...');
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

    console.log(`Found ${duplicates.length} duplicate groups\n`);

    let totalDeleted = 0;

    // Step 2: For each duplicate group, keep the oldest (first) and delete the rest
    for (const dup of duplicates) {
      const { name, ownerId } = dup._id;
      const ids = dup.ids;

      // Sort by creation timestamp (oldest first)
      const records = await collection.find({ _id: { $in: ids } })
        .sort({ createdAt: 1 })
        .toArray();

      // Keep the first (oldest) record
      const keepId = records[0]._id;
      const deleteIds = records.slice(1).map(r => r._id);

      console.log(`\n[${name}] (Owner: ${ownerId})`);
      console.log(`  Total: ${records.length} records`);
      console.log(`  ✅ Keep: ${keepId} (oldest)`);
      
      for (const deleteId of deleteIds) {
        console.log(`  ✗ Delete: ${deleteId}`);
        await collection.deleteOne({ _id: deleteId });
        totalDeleted++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ CLEANUP COMPLETE`);
    console.log(`Total duplicates removed: ${totalDeleted}`);
    console.log('='.repeat(60));

    // Step 3: Verify final state
    console.log('\n📊 FINAL STATE:');
    const finalCount = await collection.countDocuments({});
    const uniqueHouses = await collection.aggregate([
      {
        $group: {
          _id: { name: '$name', ownerId: '$ownerId' },
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    console.log(`Total records: ${finalCount}`);
    console.log(`Unique (name, owner) combinations: ${uniqueHouses.length}`);
    
    // List all remaining records
    console.log('\n📋 REMAINING BOARDING HOUSES:');
    const allHouses = await collection.find({}).toArray();
    allHouses.forEach((h, i) => {
      console.log(`${i+1}. ${h.name} (Owner: ${h.ownerId}, ID: ${h._id})`);
    });

    await mongoose.connection.close();
    console.log('\n✓ Database cleanup finished');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

removeDuplicates();
