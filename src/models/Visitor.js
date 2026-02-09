const { getCollection } = require('../../config/database');

/**
 * Visitor Model - Manages hotel guests with embedded data
 */
class Visitor {
  constructor() {
    this.collectionName = 'visitors';
  }

  getCollection() {
    return getCollection(this.collectionName);
  }

  /**
   * Create a new visitor
   */
  async create(visitorData) {
    const collection = this.getCollection();
    const visitor = {
      nationalCode: visitorData.nationalCode,
      personalInfo: {
        name: visitorData.name,
        age: visitorData.age,
        phones: visitorData.phones || [],
        addresses: visitorData.addresses || []
      },
      reservationInfo: {
        reserveDate: new Date(visitorData.reserveDate),
        checkOutDate: visitorData.checkOutDate ? new Date(visitorData.checkOutDate) : null,
        isActive: true,
        stayDays: 0,
        roomPrice: visitorData.roomPrice || 0,
        handledByPersonnel: visitorData.handledByPersonnel
      },
      parking: visitorData.parking || { hasCar: false },
      foodOrders: [],
      environmentUsage: [],
      eventParticipation: [],
      statistics: {
        totalFoodOrders: 0,
        totalSpentOnFood: 0,
        averageOrderPrice: 0,
        isVIP: false
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    const result = await collection.insertOne(visitor);
    return result;
  }

  /**
   * Find visitor by national code
   */
  async findByNationalCode(nationalCode) {
    const collection = this.getCollection();
    return await collection.findOne({ nationalCode });
  }

  /**
   * Find all active visitors
   */
  async findActive() {
    const collection = this.getCollection();
    return await collection.find({
      $or: [
        { "reservationInfo.checkOutDate": null },
        { "reservationInfo.checkOutDate": { $gt: new Date() } }
      ]
    }).toArray();
  }

  /**
   * Add food order to visitor
   */
  async addFoodOrder(nationalCode, orderData) {
    const collection = this.getCollection();
    return await collection.updateOne(
      { nationalCode },
      {
        $push: { foodOrders: orderData },
        $inc: {
          "statistics.totalFoodOrders": 1,
          "statistics.totalSpentOnFood": orderData.totalPrice
        },
        $set: {
          "statistics.lastOrderDate": new Date(),
          "metadata.updatedAt": new Date()
        }
      }
    );
  }

  /**
   * Update VIP status
   */
  async updateVIPStatus(nationalCode, isVIP) {
    const collection = this.getCollection();
    return await collection.updateOne(
      { nationalCode },
      {
        $set: {
          "statistics.isVIP": isVIP,
          "metadata.updatedAt": new Date()
        }
      }
    );
  }

  /**
   * Check out visitor
   */
  async checkOut(nationalCode) {
    const collection = this.getCollection();
    return await collection.updateOne(
      { nationalCode },
      {
        $set: {
          "reservationInfo.checkOutDate": new Date(),
          "reservationInfo.isActive": false,
          "metadata.updatedAt": new Date()
        }
      }
    );
  }

  /**
   * Get visitor statistics
   */
  async getStatistics(nationalCode) {
    const collection = this.getCollection();
    return await collection.findOne(
      { nationalCode },
      { projection: { statistics: 1, personalInfo: { name: 1 } } }
    );
  }
}

module.exports = new Visitor();