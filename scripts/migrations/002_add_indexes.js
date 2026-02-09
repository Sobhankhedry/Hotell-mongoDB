const { connect, getDb, disconnect } = require('../../config/database');

/**
 * Migration 002: Add indexes for better query performance
 */
async function up() {
  console.log('Running migration 002: Creating indexes...');

  try {
    await connect();
    const db = getDb();

    // Visitors collection indexes
    await db.collection('visitors').createIndex({ nationalCode: 1 }, { unique: true });
    await db.collection('visitors').createIndex({ 'reservationInfo.isActive': 1 });
    await db.collection('visitors').createIndex({ 'reservationInfo.checkOutDate': 1 });
    await db.collection('visitors').createIndex({ 'foodOrders.orderDate': -1 });
    await db.collection('visitors').createIndex({ 'statistics.isVIP': 1 });
    await db.collection('visitors').createIndex({ 'personalInfo.phones': 1 });
    console.log('✓ Visitors indexes created');

    // Rooms collection indexes
    await db.collection('rooms').createIndex({ roomId: 1 }, { unique: true });
    await db.collection('rooms').createIndex({ status: 1 });
    await db.collection('rooms').createIndex({ floor: 1, status: 1 });
    await db.collection('rooms').createIndex({ 'cleaning.lastCleanDate': 1 });
    console.log('✓ Rooms indexes created');

    // Foods collection indexes
    await db.collection('foods').createIndex({ foodId: 1 }, { unique: true });
    await db.collection('foods').createIndex({ category: 1, rating: -1 });
    await db.collection('foods').createIndex({ 'statistics.totalOrders': -1 });
    await db.collection('foods').createIndex({ 'availability.isAvailable': 1 });
    console.log('✓ Foods indexes created');

    // Personnel collection indexes
    await db.collection('personnel').createIndex({ personnelId: 1 }, { unique: true });
    await db.collection('personnel').createIndex({ role: 1 });
    console.log('✓ Personnel indexes created');

    // Outside Orders indexes
    await db.collection('outsideOrders').createIndex({ orderId: 1 }, { unique: true });
    await db.collection('outsideOrders').createIndex({ orderDate: -1 });
    await db.collection('outsideOrders').createIndex({ 'customerContact.phone': 1 });
    console.log('✓ OutsideOrders indexes created');

    // Events indexes
    await db.collection('events').createIndex({ eventId: 1 }, { unique: true });
    await db.collection('events').createIndex({ eventDate: -1 });
    console.log('✓ Events indexes created');

    // Parking Spaces indexes
    await db.collection('parkingSpaces').createIndex({ spaceId: 1 }, { unique: true });
    await db.collection('parkingSpaces').createIndex({ isOccupied: 1, floor: 1 });
    console.log('✓ ParkingSpaces indexes created');

    // Users indexes
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
    console.log('✓ Users indexes created');

    console.log('\\nMigration 002 completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
    throw error;
  } finally {
    await disconnect();
  }
}

// Run migration
if (require.main === module) {
  up().catch(console.error);
}

module.exports = { up };