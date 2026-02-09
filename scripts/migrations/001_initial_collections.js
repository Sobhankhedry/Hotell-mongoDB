const { connect, getDb, disconnect } = require('../../config/database');

/**
 * Migration 001: Create initial collections with validators
 */\nasync function up() {
  console.log('Running migration 001: Creating collections...');

  try {
    await connect();
    const db = getDb();

    // Create visitors collection
    await db.createCollection('visitors', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['nationalCode', 'personalInfo', 'reservationInfo'],
          properties: {
            nationalCode: {
              bsonType: 'string',
              pattern: '^[0-9]{10}$',
              description: '10-digit national code (unique identifier)'
            },
            personalInfo: {
              bsonType: 'object',
              required: ['name', 'age'],
              properties: {
                name: { bsonType: 'string', minLength: 2 },
                age: { bsonType: 'int', minimum: 18, maximum: 120 },
                phones: { 
                  bsonType: 'array',
                  items: { bsonType: 'string', pattern: '^[0-9]{10,12}$' }
                },
                addresses: {
                  bsonType: 'array',
                  items: { bsonType: 'string', maxLength: 300 }
                }
              }
            },
            reservationInfo: {
              bsonType: 'object',
              required: ['reserveDate', 'handledByPersonnel'],
              properties: {
                reserveDate: { bsonType: 'date' },
                checkOutDate: { bsonType: ['date', 'null'] },
                isActive: { bsonType: 'bool' },
                stayDays: { bsonType: 'int' },
                roomPrice: { bsonType: 'double', minimum: 0 }
              }
            }
          }
        }
      }
    });
    console.log('✓ Visitors collection created');

    // Create rooms collection
    await db.createCollection('rooms', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['roomId', 'floor', 'capacity'],
          properties: {
            roomId: { bsonType: 'int' },
            floor: { bsonType: 'int', minimum: 0 },
            capacity: { bsonType: 'int', minimum: 1 },
            status: { 
              enum: ['available', 'occupied', 'maintenance', 'cleaning']
            }
          }
        }
      }
    });
    console.log('✓ Rooms collection created');

    // Create foods collection
    await db.createCollection('foods', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['foodId', 'name', 'category', 'price'],
          properties: {
            foodId: { bsonType: 'int' },
            name: { bsonType: 'string', minLength: 3 },
            type: { enum: ['VIP', 'Normal', 'Budget'] },
            category: { bsonType: 'string' },
            price: { bsonType: 'double', minimum: 0 },
            rating: { bsonType: 'double', minimum: 1, maximum: 5 }
          }
        }
      }
    });
    console.log('✓ Foods collection created');

    // Create personnel collection
    await db.createCollection('personnel', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['personnelId', 'name', 'role'],
          properties: {
            personnelId: { bsonType: 'int' },
            name: { bsonType: 'string' },
            role: { bsonType: 'string' },
            age: { bsonType: 'int', minimum: 18 }
          }
        }
      }
    });
    console.log('✓ Personnel collection created');

    // Create outsideOrders collection
    await db.createCollection('outsideOrders', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['orderId', 'customerName', 'orderDate'],
          properties: {
            orderId: { bsonType: 'string' },
            customerName: { bsonType: 'string', minLength: 3 },
            orderDate: { bsonType: 'date' },
            orderType: { enum: ['dine-in', 'takeout', 'delivery'] }
          }
        }
      }
    });
    console.log('✓ OutsideOrders collection created');

    // Create events collection
    await db.createCollection('events', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['eventId', 'eventName', 'venue'],
          properties: {
            eventId: { bsonType: 'int' },
            eventName: { bsonType: 'string' },
            presenter: { bsonType: 'string' },
            eventDate: { bsonType: 'date' },
            eventType: { enum: ['concert', 'conference', 'party', 'workshop'] }
          }
        }
      }
    });
    console.log('✓ Events collection created');

    // Create parkingSpaces collection
    await db.createCollection('parkingSpaces', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['spaceId', 'floor'],
          properties: {
            spaceId: { bsonType: 'int' },
            floor: { bsonType: 'int' },
            isOccupied: { bsonType: 'bool' }
          }
        }
      }
    });
    console.log('✓ ParkingSpaces collection created');

    // Create users collection
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['username', 'passwordHash', 'fullName'],
          properties: {
            username: { bsonType: 'string', pattern: '^[a-zA-Z0-9_]{4,}$' },
            passwordHash: { bsonType: 'string' },
            fullName: { bsonType: 'string' },
            email: { bsonType: 'string', pattern: '^.+@.+$' },
            isActive: { bsonType: 'bool' }
          }
        }
      }
    });
    console.log('✓ Users collection created');

    console.log('\\nMigration 001 completed successfully!');
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