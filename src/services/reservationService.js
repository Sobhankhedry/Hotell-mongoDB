const Visitor = require('../models/Visitor');
const Room = require('../models/Room');
const ParkingSpace = require('../models/ParkingSpace');
const Personnel = require('../models/Personnel');

/**
 * Reservation Service - Handles complete reservation flow
 */
class ReservationService {
  /**
   * Create complete reservation
   */
  async createReservation(reservationData) {
    try {
      // 1. Check if room is available
      const room = await Room.findById(reservationData.roomId);
      if (!room || room.status !== 'available') {
        throw new Error('Room is not available');
      }

      // 2. Get personnel info
      const personnel = await Personnel.findById(reservationData.personnelId);
      if (!personnel) {
        throw new Error('Personnel not found');
      }

      // 3. Create visitor
      const visitorData = {
        nationalCode: reservationData.nationalCode,
        name: reservationData.name,
        age: reservationData.age,
        phones: reservationData.phones,
        addresses: reservationData.addresses,
        reserveDate: reservationData.reserveDate,
        roomPrice: room.pricePerNight,
        handledByPersonnel: {
          personnelId: personnel.personnelId,
          name: personnel.name,
          role: personnel.role
        },
        parking: reservationData.parking || { hasCar: false }
      };

      await Visitor.create(visitorData);

      // 4. Assign room to visitor
      await Room.assignToVisitor(reservationData.roomId, {
        nationalCode: reservationData.nationalCode,
        name: reservationData.name,
        checkInDate: new Date(reservationData.reserveDate),
        expectedCheckOut: reservationData.expectedCheckOut ? new Date(reservationData.expectedCheckOut) : null
      });

      // 5. Assign visitor to personnel
      await Personnel.assignVisitor(personnel.personnelId, reservationData.nationalCode);
      await Personnel.assignRoom(personnel.personnelId, reservationData.roomId);

      // 6. Handle parking if needed
      let parkingInfo = null;
      if (reservationData.parking?.hasCar) {
        const availableSpaces = await ParkingSpace.findAvailable();
        if (availableSpaces.length > 0) {
          const parkingSpace = availableSpaces[0];
          await ParkingSpace.assignSpace(parkingSpace.spaceId, {
            plateNumber: reservationData.parking.carPlateNumber,
            ownerNationalCode: reservationData.nationalCode,
            ownerName: reservationData.name
          });
          parkingInfo = { spaceId: parkingSpace.spaceId, floor: parkingSpace.floor };
        }
      }

      return {
        success: true,
        message: 'Reservation created successfully',
        data: {
          nationalCode: reservationData.nationalCode,
          roomId: reservationData.roomId,
          personnelId: personnel.personnelId,
          parking: parkingInfo
        }
      };
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  /**
   * Complete checkout process
   */
  async completeCheckout(nationalCode) {
    try {
      const visitor = await Visitor.findByNationalCode(nationalCode);
      if (!visitor) {
        throw new Error('Visitor not found');
      }

      // Calculate final bill
      const roomPrice = visitor.reservationInfo.roomPrice;
      const foodTotal = visitor.statistics?.totalSpentOnFood || 0;
      const totalBill = roomPrice + foodTotal;

      // Check out visitor
      await Visitor.checkOut(nationalCode);

      // Release parking if applicable
      if (visitor.parking?.parkingSpace) {
        await ParkingSpace.releaseSpace(visitor.parking.parkingSpace.spaceId);
      }

      return {
        success: true,
        message: 'Checkout completed successfully',
        bill: {
          roomPrice,
          foodTotal,
          totalBill,
          stayDays: visitor.reservationInfo.stayDays || 0
        }
      };
    } catch (error) {
      console.error('Error completing checkout:', error);
      throw error;
    }
  }
}

module.exports = new ReservationService();