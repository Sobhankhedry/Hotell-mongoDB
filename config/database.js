const { MongoClient } = require('mongodb');
const config = require('./environment');

let client = null;
let db = null;

/**
 * Connect to MongoDB
 */
async function connect() {
  try {
    if (client) {
      return { client, db };
    }

    client = new MongoClient(config.mongodb.uri, {
      maxPoolSize: config.mongodb.poolSize,
      serverSelectionTimeoutMS: config.mongodb.timeout,
    });

    await client.connect();
    console.log('Successfully connected to MongoDB');

    db = client.db(config.mongodb.dbName);
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
async function disconnect() {
  try {
    if (client) {
      await client.close();
      client = null;
      db = null;
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}

/**
 * Get database instance
 */
function getDb() {
  if (!db) {
    throw new Error('Database not connected. Call connect() first');
  }
  return db;
}

/**
 * Get collection
 */
function getCollection(name) {
  const database = getDb();
  return database.collection(name);
}

module.exports = {
  connect,
  disconnect,
  getDb,
  getCollection
};