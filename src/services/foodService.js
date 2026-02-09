const Food = require('../models/Food');

/**
 * Food Service - Business logic for food operations
 */
class FoodService {
  /**
   * Get all available foods
   */
  async getAvailableFoods() {
    try {
      return await Food.findAvailable();
    } catch (error) {
      console.error('Error getting available foods:', error);
      throw error;
    }
  }

  /**
   * Get foods by category
   */
  async getFoodsByCategory(category) {
    try {
      return await Food.findByCategory(category);
    } catch (error) {
      console.error('Error getting foods by category:', error);
      throw error;
    }
  }

  /**
   * Get top rated foods
   */
  async getTopRatedFoods(limit = 10) {
    try {
      return await Food.getTopRated(limit);
    } catch (error) {
      console.error('Error getting top rated foods:', error);
      throw error;
    }
  }

  /**
   * Add new food item
   */
  async addFood(foodData) {
    try {
      // Check if food ID already exists
      const existing = await Food.findById(foodData.foodId);
      if (existing) {
        throw new Error('Food item with this ID already exists');
      }

      return await Food.create(foodData);
    } catch (error) {
      console.error('Error adding food:', error);
      throw error;
    }
  }

  /**
   * Update food availability
   */
  async updateAvailability(foodId, isAvailable) {
    try {
      await Food.updateAvailability(foodId, isAvailable);
      return { success: true, message: 'Food availability updated' };
    } catch (error) {
      console.error('Error updating food availability:', error);
      throw error;
    }
  }

  /**
   * Record food order
   */
  async recordOrder(foodId, orderPrice) {
    try {
      await Food.updateStatistics(foodId, orderPrice);
      return { success: true };
    } catch (error) {
      console.error('Error recording food order:', error);
      throw error;
    }
  }

  /**
   * Get food details
   */
  async getFoodDetails(foodId) {
    try {
      return await Food.findById(foodId);
    } catch (error) {
      console.error('Error getting food details:', error);
      throw error;
    }
  }
}

module.exports = new FoodService();