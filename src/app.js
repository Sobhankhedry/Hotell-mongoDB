require('dotenv').config();
const { connect, disconnect } = require('../config/database');
const { startChangeStreams, stopChangeStreams } = require('./utils/changeStreams');

// Services
const VisitorService = require('./services/visitorService');
const RoomService = require('./services/roomService');
const FoodService = require('./services/foodService');
const ReservationService = require('./services/reservationService');

/**
 * Hotel Management System - Main Application
 */
class HotelApp {
  constructor() {
    this.isRunning = false;
  }

  /**
   * Initialize the application
   */
  async initialize() {
    try {
      console.log('🏨 Initializing Hotel Management System...');
      
      // Connect to database
      await connect();
      console.log('✓ Database connected');

      // Start change streams for real-time monitoring
      startChangeStreams();
      console.log('✓ Change streams started');

      this.isRunning = true;
      console.log('\\n🎉 Hotel Management System is running!\\n');

      // Example usage
      await this.demonstrateFeatures();

    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      process.exit(1);
    }
  }

  /**
   * Demonstrate system features
   */
  async demonstrateFeatures() {
    try {
      console.log('=== Demonstrating System Features ===\\n');

      // 1. Get available rooms
      console.log('1. Checking available rooms...');
      const availableRooms = await RoomService.getAvailableRooms();
      console.log(`   Found ${availableRooms.length} available rooms`);

      // 2. Get available foods
      console.log('\\n2. Fetching food menu...');
      const foods = await FoodService.getAvailableFoods();
      console.log(`   Menu has ${foods.length} items available`);

      // 3. Get top rated foods
      console.log('\\n3. Top rated foods:');
      const topFoods = await FoodService.getTopRatedFoods(5);
      topFoods.forEach((food, index) => {
        console.log(`   ${index + 1}. ${food.name} - Rating: ${food.rating}/5`);
      });

      // 4. Get active visitors
      console.log('\\n4. Active visitors:');
      const activeVisitors = await VisitorService.getActiveVisitors();
      console.log(`   Currently ${activeVisitors.length} active visitors`);

      console.log('\\n=== Demo Complete ===\\n');
      console.log('System is ready to handle operations.\\n');

    } catch (error) {
      console.error('Error demonstrating features:', error);
    }
  }

  /**
   * Shutdown the application gracefully
   */
  async shutdown() {
    try {
      console.log('\\n🛑 Shutting down Hotel Management System...');
      
      // Stop change streams
      stopChangeStreams();
      console.log('✓ Change streams stopped');

      // Disconnect from database
      await disconnect();
      console.log('✓ Database disconnected');

      this.isRunning = false;
      console.log('✓ Application shut down successfully');
      
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Create and start the application
const app = new HotelApp();

// Handle graceful shutdown
process.on('SIGINT', () => app.shutdown());
process.on('SIGTERM', () => app.shutdown());

// Start the application
if (require.main === module) {
  app.initialize().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = app;