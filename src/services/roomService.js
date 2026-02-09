const Room = require('../models/Room');

/**
 * Room Service - Business logic for room operations
 */
class RoomService {
  /**
   * Get available rooms
   */
  async getAvailableRooms(floor = null) {
    try {
      return await Room.findAvailable(floor);
    } catch (error) {
      console.error('Error getting available rooms:', error);
      throw error;
    }
  }

  /**
   * Assign room to visitor
   */
  async assignRoom(roomId, visitorData) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      if (room.status !== 'available') {
        throw new Error('Room is not available');
      }

      await Room.assignToVisitor(roomId, visitorData);
      return { success: true, message: 'Room assigned successfully' };
    } catch (error) {
      console.error('Error assigning room:', error);
      throw error;
    }
  }

  /**
   * Update room status
   */
  async updateRoomStatus(roomId, status) {
    try {
      const validStatuses = ['available', 'occupied', 'maintenance', 'cleaning'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid room status');
      }

      await Room.updateStatus(roomId, status);
      return { success: true, message: 'Room status updated' };
    } catch (error) {
      console.error('Error updating room status:', error);
      throw error;
    }
  }

  /**
   * Clean room
   */
  async cleanRoom(roomId, cleanedBy) {
    try {
      await Room.updateCleaning(roomId, cleanedBy);
      await Room.updateStatus(roomId, 'available', 'Room cleaned');
      return { success: true, message: 'Room cleaned successfully' };
    } catch (error) {
      console.error('Error cleaning room:', error);
      throw error;
    }
  }

  /**
   * Get rooms by floor
   */
  async getRoomsByFloor(floor) {
    try {
      return await Room.findByFloor(floor);
    } catch (error) {
      console.error('Error getting rooms by floor:', error);
      throw error;
    }
  }

  /**
   * Get room details
   */
  async getRoomDetails(roomId) {
    try {
      return await Room.findById(roomId);
    } catch (error) {
      console.error('Error getting room details:', error);
      throw error;
    }
  }
}

module.exports = new RoomService();