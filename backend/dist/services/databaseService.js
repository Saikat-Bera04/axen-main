"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEventToDatabase = saveEventToDatabase;
exports.getEventsFromDatabase = getEventsFromDatabase;
exports.updateEventVerification = updateEventVerification;
const Event_1 = require("../models/Event");
const product_1 = require("../models/product");
async function saveEventToDatabase(eventData) {
    try {
        const event = new Event_1.EventModel({
            productId: eventData.productId,
            stage: eventData.stage,
            submitter: eventData.actorId,
            timestamp: new Date(),
            metadata: {
                temperature: eventData.temperature,
                notes: eventData.notes,
                location: eventData.location
            },
            ipfsHash: eventData.evidenceHashes[0] || 'QmDefault...',
            aiVerified: 'pending',
            transactionHash: eventData.txHash
        });
        const savedEvent = await event.save();
        // Update or create product
        await product_1.ProductModel.findOneAndUpdate({ productId: eventData.productId }, {
            $set: {
                batchId: eventData.productId,
                currentStage: eventData.stage,
                lastUpdated: new Date(),
                submitter: eventData.actorId,
                verificationStatus: 'pending'
            },
            $inc: { eventsCount: 1 }
        }, { upsert: true, new: true });
        return savedEvent;
    }
    catch (error) {
        console.error('Database save error:', error);
        throw error;
    }
}
async function getEventsFromDatabase(productId) {
    try {
        const events = await Event_1.EventModel.find({ productId }).sort({ timestamp: 1 });
        return events;
    }
    catch (error) {
        console.error('Database fetch error:', error);
        throw error;
    }
}
async function updateEventVerification(eventId, status) {
    try {
        await Event_1.EventModel.findByIdAndUpdate(eventId, { aiVerified: status });
        // Update product verification status
        const event = await Event_1.EventModel.findById(eventId);
        if (event) {
            await product_1.ProductModel.findOneAndUpdate({ productId: event.productId }, { verificationStatus: status });
        }
    }
    catch (error) {
        console.error('Verification update error:', error);
        throw error;
    }
}
//# sourceMappingURL=databaseService.js.map