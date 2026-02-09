const { getCollection } = require('../../config/database');

/**
 * Room Model - Manages hotel rooms
 */
class Room {
  constructor() {
    this.collectionName = 'rooms';
  }

  getCollection() {
    return getCollection(this.collectionName);
  }

  /**
   * Create a new room
   */
  async create(roomData) {
    const collection = this.getCollection();
    const room = {
      roomId: roomData.roomId,
      floor: roomData.floor,
      capacity: roomData.capacity,
      status: roomData.status || 'available',
      cleaning: {
        lastCleanDate: new Date(),
        daysSinceClean: 0,
        nextScheduledClean: new Date(Date.now() + 24 * 60 * 60 * 1000),
        cleanedBy: roomData.cleanedBy || null
      },
      currentOccupant: null,
      assignedPersonnel: roomData.assignedPersonnel || null,
      amenities: roomData.amenities || [],
      pricePerNight: roomData.pricePerNight || 0,
      history: []
    };

    const result = await collection.insertOne(room);
    return result;
  }

  /**
   * Find room by ID
   */
  async findById(roomId) {
    const collection = this.getCollection();
    return await collection.findOne({ roomId });
  }

  /**
   * Find available rooms
   */
  async findAvailable(floor = null) {
    const collection = this.getCollection();
    const query = { status: 'available' };
    if (floor !== null) {
      query.floor = floor;
    }
    return await collection.find(query).toArray();
  }

  /**
   * Update room status
   */
  async updateStatus(roomId, status, details = '') {
    const collection = this.getCollection();
    return await collection.updateOne(
      { roomId },
      {
        $set: { status },
        $push: {
          history: {
            action: `Status changed to ${status}`,
            timestamp: new Date(),
            performedBy: 'system',
            details
          }
        }
      }
    );
  }

  /**
   * Assign room to visitor
   */
  async assignToVisitor(roomId, visitorData) {
    const collection = this.getCollection();
    return await collection.updateOne(
      { roomId },
      {
        $set: {
          status: 'occupied',
          currentOccupant: visitorData
        },
        $push: {
          history: {
            action: 'Room occupied',
            timestamp: new Date(),
            performedBy: visitorData.name,
            details: `Checked in: ${visitorData.nationalCode}`
          }
        }
      }
    );
  }

  /**
   * Update cleaning info
   */
  async updateCleaning(roomId, cleanedBy) {
    const collection = this.getCollection();
    return await collection.updateOne(
      { roomId },
      {
        $set: {
          'cleaning.lastCleanDate': new Date(),
          'cleaning.daysSinceClean': 0,
          'cleaning.cleanedBy': cleanedBy
        }
      }
    );
  }

  /**
   * Get rooms by floor
   */
  async findByFloor(floor) {
    const collection = this.getCollection();
    return await collection.find({ floor }).toArray();
  }
}

module.exports = new Room();
