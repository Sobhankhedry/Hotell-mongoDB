const Visitor = require('../models/Visitor');
const Room = require('../models/Room');
const Personnel = require('../models/Personnel');

/**
 * Visitor Service - Business logic for visitor operations
 */
class VisitorService {
  /**
   * Register a new visitor
   */
  async registerVisitor(visitorData) {
    try {
      // Check if visitor already exists
      const existing = await Visitor.findByNationalCode(visitorData.nationalCode);
      if (existing) {
        throw new Error('Visitor with this national code already exists');
      }

      // Create visitor
      const result = await Visitor.create(visitorData);

      // Assign to personnel if specified
      if (visitorData.handledByPersonnel?.personnelId) {
        await Personnel.assignVisitor(
          visitorData.handledByPersonnel.personnelId,
          visitorData.nationalCode
        );
      }

      return result;
    } catch (error) {
      console.error('Error registering visitor:', error);
      throw error;
    }
  }

  /**
   * Check out visitor
   */
  async checkOutVisitor(nationalCode) {
    try {
      const visitor = await Visitor.findByNationalCode(nationalCode);
      if (!visitor) {
        throw new Error('Visitor not found');
      }

      // Update visitor checkout
      await Visitor.checkOut(nationalCode);

      return { success: true, message: 'Visitor checked out successfully' };
    } catch (error) {
      console.error('Error checking out visitor:', error);
      throw error;
    }
  }

  /**
   * Place food order for visitor
   */
  async placeOrder(nationalCode, orderData) {
    try {
      const visitor = await Visitor.findByNationalCode(nationalCode);
      if (!visitor) {
        throw new Error('Visitor not found');
      }

      // Add order
      await Visitor.addFoodOrder(nationalCode, orderData);

      // Check VIP status (more than 15 orders or high spending)
      if (visitor.statistics.totalFoodOrders + 1 > 15) {
        await Visitor.updateVIPStatus(nationalCode, true);
      }

      return { success: true, message: 'Order placed successfully' };
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  /**
   * Get active visitors
   */
  async getActiveVisitors() {
    try {
      return await Visitor.findActive();
    } catch (error) {
      console.error('Error getting active visitors:', error);
      throw error;
    }
  }

  /**
   * Get visitor statistics
   */
  async getVisitorStatistics(nationalCode) {
    try {
      return await Visitor.getStatistics(nationalCode);
    } catch (error) {
      console.error('Error getting visitor statistics:', error);
      throw error;
    }
  }
}

module.exports = new VisitorService();