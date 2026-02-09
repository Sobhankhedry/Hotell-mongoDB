const { connect, getDb, disconnect } = require('../../config/database');

/**
 * Seed rooms data
 */
async function seedRooms() {
  console.log('Seeding rooms data...');

  try {
    await connect();
    const db = getDb();
    const collection = db.collection('rooms');

    // Check if data already exists
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log('Rooms already seeded. Skipping...');
      return;
    }

    const rooms = [];
    let roomId = 1;

    // Create rooms for 5 floors, 10 rooms per floor
    for (let floor = 1; floor <= 5; floor++) {
      for (let roomNum = 1; roomNum <= 10; roomNum++) {
        rooms.push({
          roomId: roomId++,
          floor: floor,
          capacity: roomNum <= 5 ? 2 : 4, // First 5 rooms: capacity 2, rest: capacity 4
          status: 'available',
          cleaning: {
            lastCleanDate: new Date(),
            daysSinceClean: 0,
            nextScheduledClean: new Date(Date.now() + 24 * 60 * 60 * 1000),
            cleanedBy: null
          },
          currentOccupant: null,
          assignedPersonnel: null,
          amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
          pricePerNight: floor * 1000000 + (roomNum <= 5 ? 0 : 500000), // Higher floors cost more
          history: []
        });
      }
    }

    await collection.insertMany(rooms);
    console.log(`✓ Seeded ${rooms.length} rooms`);
  } catch (error) {
    console.error('Error seeding rooms:', error);
    throw error;
  } finally {
    await disconnect();
  }
}

// Run seed
if (require.main === module) {
  seedRooms().catch(console.error);
}

module.exports = seedRooms;