"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsFromDatabase = exports.updateEventVerification = exports.saveEventToDatabase = void 0;
const Event_1 = require("../models/Event");
const saveEventToDatabase = async (eventData) => {
    try {
        const event = new Event_1.EventModel(eventData);
        return await event.save();
    }
    catch (error) {
        console.error('Error saving event to database:', error);
        throw new Error('Failed to save event to database');
    }
};
exports.saveEventToDatabase = saveEventToDatabase;
const updateEventVerification = async (eventId, verified, verificationData) => {
    try {
        return await Event_1.EventModel.findByIdAndUpdate(eventId, {
            verified,
            verificationData,
            verifiedAt: new Date()
        }, { new: true });
    }
    catch (error) {
        console.error('Error updating event verification:', error);
        throw new Error('Failed to update event verification');
    }
};
exports.updateEventVerification = updateEventVerification;
const getEventsFromDatabase = async (productId) => {
    try {
        return await Event_1.EventModel.find({ productId }).sort({ timestamp: 1 });
    }
    catch (error) {
        console.error('Error fetching events from database:', error);
        throw new Error('Failed to fetch events from database');
    }
};
exports.getEventsFromDatabase = getEventsFromDatabase;
//# sourceMappingURL=databaseServices.js.map