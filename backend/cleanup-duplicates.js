const mongoose = require('mongoose');
const env = require('./src/config/env');
const BoardingHouse = require('./src/models/BoardingHouse');

mongoose.connect(env.mongoUri)
  .then(async () => {
    console.log('🧹 Cleaning up duplicate boarding houses...\n');
    
    // IDs to delete (the duplicates)
    const idsToDelete = [
      '69c7605e41daa23f76d61d64',
      '69c7605e41daa23f76d61d65',
      '69c7605e41daa23f76d61d66'
    ];

    for (const id of idsToDelete) {
      const house = await BoardingHouse.findByIdAndDelete(id);
      if (house) {
        console.log(`✓ Deleted: ${house.name} (${id})`);
      }
    }

    // Verify remaining records
    const remaining = await BoardingHouse.find({ ownerId: '69c619922f17b48d6c7ea8f2' }).select('_id name');
    console.log(`\n✅ Cleanup complete. Remaining records: ${remaining.length}\n`);
    remaining.forEach((h, i) => console.log(`  [${i + 1}] ${h.name} (${h._id})`));

    process.exit(0);
  })
  .catch(e => { console.error('Error:', e.message); process.exit(1); });
