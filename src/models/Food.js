const { getCollection } = require('../../config/database');

/**
 * Food Model - Manages food menu items
 */
class Food {
  constructor() {
    this.collectionName = 'foods';
  }

  getCollection() {
    return getCollection(this.collectionName);
  }

  /**
   * Create a new food item
   */
  async create(foodData) {
    const collection = this.getCollection();
    const food = {
      foodId: foodData.foodId,
      name: foodData.name,
      type: foodData.type || 'Normal',
      category: foodData.category,
      description: foodData.description || '',
      price: foodData.price,
      rating: foodData.rating || 0,
      photo: foodData.photo || '',
      ingredients: foodData.ingredients || [],
      allergens: foodData.allergens || [],
      nutritionalInfo: foodData.nutritionalInfo || {},
      availability: {
        isAvailable: true,
        seasonalItem: false,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      statistics: {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderPrice: 0,
        lastOrderDate: null,
        popularityScore: 0
      },
      pricing: {
        basePrice: foodData.price,
        vipDiscount: foodData.price * 0.20,
        normalDiscount: foodData.price * 0.10,
        taxRate: 0.09,
        finalPriceWithTax: foodData.price * 1.09
      }
    };

    const result = await collection.insertOne(food);
    return result;
  }

  /**
   * Find food by ID
   */
  async findById(foodId) {
    const collection = this.getCollection();
    return await collection.findOne({ foodId });
  }

  /**
   * Find all available foods
   */
  async findAvailable() {
    const collection = this.getCollection();
    return await collection.find({ 'availability.isAvailable': true }).toArray();
  }

  /**
   * Find by category
   */
  async findByCategory(category) {
    const collection = this.getCollection();
    return await collection.find({ category }).sort({ rating: -1 }).toArray();
  }

  /**
   * Get top rated foods
   */
  async getTopRated(limit = 10) {
    const collection = this.getCollection();
    return await collection.find({ rating: { $gte: 4 } })
      .sort({ rating: -1 })
      .limit(limit)
      .toArray();
  }

  /**
   * Update statistics after order
   */
  async updateStatistics(foodId, orderPrice) {
    const collection = this.getCollection();
    const food = await this.findById(foodId);
    const newTotalOrders = (food.statistics?.totalOrders || 0) + 1;
    const newTotalRevenue = (food.statistics?.totalRevenue || 0) + orderPrice;

    return await collection.updateOne(
      { foodId },
      {
        $inc: {
          'statistics.totalOrders': 1,
          'statistics.totalRevenue': orderPrice
        },
        $set: {
          'statistics.averageOrderPrice': newTotalRevenue / newTotalOrders,
          'statistics.lastOrderDate': new Date()
        }
      }
    );
  }

  /**
   * Update availability
   */
  async updateAvailability(foodId, isAvailable) {
    const collection = this.getCollection();
    return await collection.updateOne(
      { foodId },
      { $set: { 'availability.isAvailable': isAvailable } }
    );
  }
}

module.exports = new Food();