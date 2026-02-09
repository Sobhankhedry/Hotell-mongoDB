const { getCollection } = require('../../config/database');

/**
 * Personnel Model - Manages hotel staff
 */
class Personnel {
  constructor() {
    this.collectionName = 'personnel';
  }

  getCollection() {
    return getCollection(this.collectionName);
  }

  /**
   * Create new personnel
   */
  async create(personnelData) {
    const collection = this.getCollection();
    const personnel = {
      personnelId: personnelData.personnelId,
      name: personnelData.name,
      role: personnelData.role,
      age: personnelData.age,
      hireDate: new Date(personnelData.hireDate),
      contactInfo: {
        phones: personnelData.phones || [],
        email: personnelData.email || '',
        emergencyContact: personnelData.emergencyContact || null
      },
      assignments: {
        currentRooms: [],
        currentVisitors: [],
        workSchedule: personnelData.workSchedule || []
      },
      performance: {
        totalVisitorsHandled: 0,
        averageRating: 0,
        yearsOfService: 0
      }
    };

    const result = await collection.insertOne(personnel);
    return result;
  }

  /**
   * Find by ID
   */
  async findById(personnelId) {
    const collection = this.getCollection();
    return await collection.findOne({ personnelId });
  }

  /**
   * Find by role
   */
  async findByRole(role) {
    const collection = this.getCollection();
    return await collection.find({ role }).toArray();
  }

  /**
   * Assign room to personnel
   */
  async assignRoom(personnelId, roomId) {
    const collection = this.getCollection();
    return await collection.updateOne(
      { personnelId },
      { $addToSet: { 'assignments.currentRooms': roomId } }
    );
  }

  /**
   * Assign visitor to personnel
   */
  async assignVisitor(personnelId, visitorNationalCode) {
    const collection = this.getCollection();
    return await collection.updateOne(
      { personnelId },
      {
        $addToSet: { 'assignments.currentVisitors': visitorNationalCode },
        $inc: { 'performance.totalVisitorsHandled': 1 }
      }
    );
  }

  /**
   * Update work schedule
   */
  async updateSchedule(personnelId, schedule) {
    const collection = this.getCollection();
    return await collection.updateOne(
      { personnelId },
      { $set: { 'assignments.workSchedule': schedule } }
    );
  }

  /**
   * Get all personnel
   */
  async findAll() {
    const collection = this.getCollection();
    return await collection.find({}).toArray();
  }
}

module.exports = new Personnel();