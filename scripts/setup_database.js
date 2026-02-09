// MongoDB Setup Script for Hotel Database
// Run with: mongosh mongodb://localhost:27017/hotelDB --file setup_database.js

print("Creating Hotel Database...");

// Use the hotelDB database
db = db.getSiblingDB('hotelDB');

print("Creating collections with validators...");

// Create visitors collection
db.createCollection("visitors", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nationalCode", "personalInfo", "reservationInfo"],
      properties: {
        nationalCode: {
          bsonType: "string",
          pattern: "^[0-9]{10}$",
          description: "10-digit national code (unique identifier)"
        },
        personalInfo: {
          bsonType: "object",
          required: ["name", "age"],
          properties: {
            name: { bsonType: "string", minLength: 2 },
            age: { bsonType: "int", minimum: 18, maximum: 120 }
          }
        },
        reservationInfo: {
          bsonType: "object",
          required: ["reserveDate", "handledByPersonnel"],
          properties: {
            reserveDate: { bsonType: "date" },
            checkOutDate: { bsonType: ["date", "null"] },
            isActive: { bsonType: "bool" },
            stayDays: { bsonType: "int" },
            roomPrice: { bsonType: "double", minimum: 0 }
          }
        }
      }
    }
  }
});
print("✓ Visitors collection created");

// Create rooms collection
db.createCollection("rooms", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["roomId", "floor", "capacity"],
      properties: {
        roomId: { bsonType: "int" },
        floor: { bsonType: "int", minimum: 0 },
        capacity: { bsonType: "int", minimum: 1 },
        status: { 
          enum: ["available", "occupied", "maintenance", "cleaning"],
          description: "Current room status"
        }
      }
    }
  }
});
print("✓ Rooms collection created");

// Create foods collection
db.createCollection("foods", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["foodId", "name", "category", "price"],
      properties: {
        foodId: { bsonType: "int" },
        name: { bsonType: "string", minLength: 3 },
        type: { enum: ["VIP", "Normal", "Budget"] },
        category: { bsonType: "string" },
        price: { bsonType: "double", minimum: 0 },
        rating: { bsonType: "double", minimum: 1, maximum: 5 }
      }
    }
  }
});
print("✓ Foods collection created");

// Create personnel collection
db.createCollection("personnel", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["personnelId", "name", "role"],
      properties: {
        personnelId: { bsonType: "int" },
        name: { bsonType: "string" },
        role: { bsonType: "string" },
        age: { bsonType: "int", minimum: 18 }
      }
    }
  }
});
print("✓ Personnel collection created");

// Create outsideOrders collection
db.createCollection("outsideOrders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["orderId", "customerName", "orderDate"],
      properties: {
        orderId: { bsonType: "string" },
        customerName: { bsonType: "string", minLength: 3 },
        orderDate: { bsonType: "date" },
        orderType: { enum: ["dine-in", "takeout", "delivery"] }
      }
    }
  }
});
print("✓ OutsideOrders collection created");

// Create events collection
db.createCollection("events", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["eventId", "eventName", "venue"],
      properties: {
        eventId: { bsonType: "int" },
        eventName: { bsonType: "string" },
        presenter: { bsonType: "string" },
        eventDate: { bsonType: "date" },
        eventType: { enum: ["concert", "conference", "party", "workshop"] }
      }
    }
  }
});
print("✓ Events collection created");

// Create parkingSpaces collection
db.createCollection("parkingSpaces", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["spaceId", "floor"],
      properties: {
        spaceId: { bsonType: "int" },
        floor: { bsonType: "int" },
        isOccupied: { bsonType: "bool" }
      }
    }
  }
});
print("✓ ParkingSpaces collection created");

// Create users collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "passwordHash", "fullName"],
      properties: {
        username: { bsonType: "string", pattern: "^[a-zA-Z0-9_]{4,}$" },
        passwordHash: { bsonType: "string" },
        fullName: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+$" },
        isActive: { bsonType: "bool" }
      }
    }
  }
});
print("✓ Users collection created");

print("\nCreating indexes...");

// Visitors indexes
db.visitors.createIndex({ "nationalCode": 1 }, { unique: true });
db.visitors.createIndex({ "reservationInfo.isActive": 1 });
db.visitors.createIndex({ "reservationInfo.checkOutDate": 1 });
db.visitors.createIndex({ "foodOrders.orderDate": -1 });
db.visitors.createIndex({ "statistics.isVIP": 1 });
db.visitors.createIndex({ "personalInfo.phones": 1 });
print("✓ Visitors indexes created");

// Rooms indexes
db.rooms.createIndex({ "roomId": 1 }, { unique: true });
db.rooms.createIndex({ "status": 1 });
db.rooms.createIndex({ "floor": 1, "status": 1 });
db.rooms.createIndex({ "cleaning.lastCleanDate": 1 });
print("✓ Rooms indexes created");

// Foods indexes
db.foods.createIndex({ "foodId": 1 }, { unique: true });
db.foods.createIndex({ "category": 1, "rating": -1 });
db.foods.createIndex({ "statistics.totalOrders": -1 });
db.foods.createIndex({ "availability.isAvailable": 1 });
print("✓ Foods indexes created");

// Personnel indexes
db.personnel.createIndex({ "personnelId": 1 }, { unique: true });
db.personnel.createIndex({ "role": 1 });
print("✓ Personnel indexes created");

// Outside Orders indexes
db.outsideOrders.createIndex({ "orderId": 1 }, { unique: true });
db.outsideOrders.createIndex({ "orderDate": -1 });
db.outsideOrders.createIndex({ "customerContact.phone": 1 });
print("✓ OutsideOrders indexes created");

// Events indexes
db.events.createIndex({ "eventId": 1 }, { unique: true });
db.events.createIndex({ "eventDate": -1 });
print("✓ Events indexes created");

// Parking Spaces indexes
db.parkingSpaces.createIndex({ "spaceId": 1 }, { unique: true });
db.parkingSpaces.createIndex({ "isOccupied": 1, "floor": 1 });
print("✓ ParkingSpaces indexes created");

// Users indexes
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true, sparse: true });
print("✓ Users indexes created");

print("\n=== Database Setup Complete! ===");
print("Database: hotelDB");
print("Collections created: 8");
print("Indexes created: Successfully");
