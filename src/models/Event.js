const { getCollection } = require('../../config/database');

/**
 * Event Model - Manages hotel events
 */
class Event {
  constructor() {
    this.collectionName = 'events';
  }

  getCollection() {
    return getCollection(this.collectionName);
  }

  /**
   * Create new event
   */
  async create(eventData) {
    const collection = this.getCollection();
    const event = {
      eventId: eventData.eventId,
      eventName: eventData.eventName,
      presenter: eventData.presenter || null,
      eventDate: new Date(eventData.eventDate),
      venue: {
        environmentId: eventData.venue.environmentId,
        type: eventData.venue.type,
        capacity: eventData.venue.capacity,
        supervisor: eventData.venue.supervisor || null
      },
      participants: [],
      eventType: eventData.eventType || 'conference',
      ticketPrice: eventData.ticketPrice || 0,
      totalRevenue: 0
    };

    const result = await collection.insertOne(event);
    return result;
  }

  /**
   * Find by ID
   */
  async findById(eventId) {
    const collection = this.getCollection();
    return await collection.findOne({ eventId });
  }

  /**
   * Add participant to event
   */
  async addParticipant(eventId, participant) {
    const collection = this.getCollection();
    return await collection.updateOne(
      { eventId },
      {
        $push: {
          participants: {
            nationalCode: participant.nationalCode,
            name: participant.name,
            registeredAt: new Date()
          }
        },
        $inc: { totalRevenue: participant.ticketPrice || 0 }
      }
    );
  }

  /**
   * Find upcoming events
   */
  async findUpcoming() {
    const collection = this.getCollection();
    return await collection.find({
      eventDate: { $gte: new Date() }
    }).sort({ eventDate: 1 }).toArray();
  }

  /**
   * Find by presenter
   */
  async findByPresenter(presenter) {
    const collection = this.getCollection();
    return await collection.find({ presenter }).toArray();
  }

  /**
   * Get event revenue
   */
  async getRevenue(eventId) {
    const collection = this.getCollection();
    const event = await collection.findOne(
      { eventId },
      { projection: { totalRevenue: 1, eventName: 1, participants: 1 } }
    );
    return event;
  }
}

module.exports = new Event();