require('dotenv').config();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hotelDB',
    dbName: process.env.DB_NAME || 'hotelDB',
    poolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
    timeout: parseInt(process.env.DB_TIMEOUT) || 30000,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD
  },
  app: {
    port: parseInt(process.env.PORT) || 3000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development'
  },
  mongoshPath: process.env.MONGOSH_PATH || 'C:\\Users\\sobkh\\AppData\\Local\\Programs\\mongosh',
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
    sessionSecret: process.env.SESSION_SECRET || 'default_session_secret'
  }
};