const { getDb } = require('../../config/database');

/**
 * Change Streams for real-time monitoring
 */

let visitorStream = null;
let roomStream = null;
let parkingStream = null;

/**
 * Watch visitor changes
 */
function watchVisitors() {
  try {
    const db = getDb();
    visitorStream = db.collection('visitors').watch();

    visitorStream.on('change', (change) => {
      console.log('Visitor change detected:', change.operationType);

      switch (change.operationType) {
        case 'insert':
          console.log('New visitor registered:', change.fullDocument.nationalCode);
          break;
        case 'update':
          console.log('Visitor updated:', change.documentKey);
          if (change.updateDescription?.updatedFields?.['personalInfo.age']) {
            console.log('Age updated');
          }
          break;
        case 'delete':
          console.log('Visitor deleted:', change.documentKey);
          break;
      }
    });

    console.log('Visitor change stream started');
  } catch (error) {
    console.error('Error watching visitors:', error);
  }
}

/**
 * Watch room changes
 */
function watchRooms() {
  try {
    const db = getDb();
    roomStream = db.collection('rooms').watch();

    roomStream.on('change', (change) => {
      console.log('Room change detected:', change.operationType);

      if (change.operationType === 'update') {
        if (change.updateDescription?.updatedFields?.status) {
          console.log('Room status changed:', change.documentKey, 
            'New status:', change.updateDescription.updatedFields.status);
        }
      }
    });

    console.log('Room change stream started');
  } catch (error) {
    console.error('Error watching rooms:', error);
  }
}

/**
 * Watch parking space changes
 */
function watchParkingSpaces() {
  try {
    const db = getDb();
    parkingStream = db.collection('parkingSpaces').watch([
      {
        $match: {
          operationType: 'update',
          'updateDescription.updatedFields.isOccupied': { $exists: true }
        }
      }
    ]);

    parkingStream.on('change', (change) => {
      console.log('Parking space occupancy changed:', change.documentKey);
      const isOccupied = change.updateDescription?.updatedFields?.isOccupied;
      console.log('New occupancy status:', isOccupied ? 'Occupied' : 'Free');
    });

    console.log('Parking change stream started');
  } catch (error) {
    console.error('Error watching parking spaces:', error);
  }
}

/**
 * Start all change streams
 */
function startChangeStreams() {
  console.log('Starting change streams...');
  watchVisitors();
  watchRooms();
  watchParkingSpaces();
}

/**
 * Stop all change streams
 */
function stopChangeStreams() {
  console.log('Stopping change streams...');
  
  if (visitorStream) {
    visitorStream.close();
    visitorStream = null;
  }
  
  if (roomStream) {
    roomStream.close();
    roomStream = null;
  }
  
  if (parkingStream) {
    parkingStream.close();
    parkingStream = null;
  }
  
  console.log('Change streams stopped');
}

module.exports = {
  startChangeStreams,
  stopChangeStreams,
  watchVisitors,
  watchRooms,
  watchParkingSpaces
};