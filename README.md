# Hotel Management System - MongoDB Project

Advanced database project for hotel management using MongoDB with denormalized schema design.

## Project Overview

This project implements a comprehensive hotel management system using MongoDB's document-based architecture. It includes visitor management, room reservations, food ordering, parking spaces, events, and personnel management.

## Features

- **Visitor Management**: Track guests with embedded reservation info, food orders, and statistics
- **Room Management**: Real-time room status, cleaning schedules, and occupancy tracking
- **Food Service**: Menu management with ratings, categories, and order tracking
- **Parking Management**: Parking space allocation and vehicle tracking
- **Event Management**: Event planning and participant tracking
- **Personnel Management**: Staff assignments and performance tracking
- **Analytics & Reporting**: Comprehensive views and aggregation pipelines
- **Change Streams**: Real-time data synchronization

## Technology Stack

- **Database**: MongoDB 6.0+
- **Runtime**: Node.js
- **Driver**: MongoDB Native Driver
- **Environment**: dotenv for configuration

## Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB connection string

# Run migrations
npm run migrate

# Seed initial data
npm run seed

# Start the application
npm start
```

## MongoDB Shell Path

The MongoDB shell (mongosh) is located at:
```
C:\Users\sobkh\AppData\Local\Programs\mongosh
```

## Project Structure

```
hotel-db-project-1/
├── config/          # Database and environment configuration
├── docs/            # Documentation files
├── scripts/         # Database scripts
│   ├── migrations/  # Schema and index creation
│   ├── seeds/       # Sample data
│   └── queries/     # Analytics and reports
├── src/
│   ├── models/      # Data models
│   ├── services/    # Business logic
│   ├── utils/       # Helper functions
│   └── app.js       # Main application
└── tests/           # Unit and integration tests
```

## Database Schema

The system uses a denormalized schema with the following collections:

- `visitors` - Guest information with embedded orders and statistics
- `rooms` - Room details with occupancy and cleaning info
- `foods` - Menu items with ratings and availability
- `personnel` - Staff information and assignments
- `events` - Event details and participants
- `parkingSpaces` - Parking allocation and history
- `outsideOrders` - External food orders
- `users` - System users and authentication

## Running Queries

```bash
# Analytics queries
node scripts/queries/analytics.js

# Generate reports
node scripts/queries/reports.js

# Maintenance tasks
node scripts/queries/maintenance.js
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

## Development

```bash
# Development mode with auto-reload
npm run dev
```

## License

ISC