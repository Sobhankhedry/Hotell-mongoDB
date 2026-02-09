const { getCollection } = require('../../config/database');

/**
 * ParkingSpace Model - Manages parking spaces
 */
class ParkingSpace {
  constructor() {
    this.collectionName = 'parkingSpaces';
  }

  getCollection() {
    return getCollection(this.collectionName);
  }

  /**
   * Create new parking space
   */
  async create(parkingData) {
    const collection = this.getCollection();
    const parking = {
      spaceId: parkingData.spaceId,
      floor: parkingData.floor,
      isOccupied: false,
      currentVehicle: null,
      history: []
    };

    const result = await collection.insertOne(parking);
    return result;
  }

  /**
   * Find by ID
   */
  async findById(spaceId) {
    const collection = this.getCollection();
    return await collection.findOne({ spaceId });
  }

  /**
   * Find available spaces
   */
  async findAvailable(floor = null) {
    const collection = this.getCollection();
    const query = { isOccupied: false };
    if (floor !== null) {
      query.floor = floor;
    }
    return await collection.find(query).toArray();
  }

  /**
   * Assign parking space
   */
  async assignSpace(spaceId, vehicleData) {
    const collection = this.getCollection();
    return await collection.updateOne(
      { spaceId },
      {
        $set: {
          isOccupied: true,
          currentVehicle: {
            plateNumber: vehicleData.plateNumber,
            ownerNationalCode: vehicleData.ownerNationalCode,
            ownerName: vehicleData.ownerName,
            parkedAt: new Date()
          }
        },
        $push: {
          history: {
            action: 'PARKED',
            timestamp: new Date(),
            plateNumber: vehicleData.plateNumber
          }
        }
      }
    );
  }

  /**
   * Release parking space
   */
  async releaseSpace(spaceId) {
    const collection = this.getCollection();
    const space = await this.findById(spaceId);
    
    return await collection.updateOne(
      { spaceId },
      {
        $set: {
          isOccupied: false,
          currentVehicle: null
        },
        $push: {
          history: {
            action: 'DEPARTED',
            timestamp: new Date(),
            plateNumber: space.currentVehicle?.plateNumber
          }
        }
      }
    );
  }

  /**
   * Count free spaces
   */
  async countFree() {
    const collection = this.getCollection();
    return await collection.countDocuments({ isOccupied: false });
  }

  /**
   * Find by floor
   */
  async findByFloor(floor) {
    const collection = this.getCollection();
    return await collection.find({ floor }).toArray();
  }
}

module.exports = new ParkingSpace();