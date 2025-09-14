"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductEvents = exports.submitEvent = void 0;
const Event_1 = require("../models/Event");
const product_1 = require("../models/product");
const ipfsService_1 = require("../services/ipfsService");
const blockchainService_1 = require("../services/blockchainService");
const aiService_1 = require("../services/aiService");
const submitEvent = async (req, res) => {
    try {
        console.log('📝 Received event submission request');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        const { productId, stage, submitter, temperature, notes, latitude, longitude, timestamp } = req.body;
        const files = req.files;
        // Validate required fields
        if (!productId || !stage || !submitter) {
            console.log('❌ Missing required fields:', { productId, stage, submitter });
            res.status(400).json({ error: 'Missing required fields: productId, stage, and submitter' });
            return;
        }
        console.log('✅ All required fields present:', { productId, stage, submitter });
        // Upload files to IPFS
        let ipfsHash = '';
        if (files && files.length > 0) {
            ipfsHash = await (0, ipfsService_1.uploadToIPFS)(files[0]);
        }
        else {
            // Create a metadata-only IPFS entry
            const metadata = { productId, stage, submitter, temperature, notes, location: { lat: latitude, lng: longitude } };
            ipfsHash = `metadata_${Date.now()}`;
        }
        // Add to blockchain
        const transactionHash = await (0, blockchainService_1.addEventToBlockchain)({
            productId,
            stage,
            actorId: submitter,
            temperature: temperature ? parseFloat(temperature) : undefined,
            notes,
            location: latitude && longitude ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : undefined,
            evidenceHashes: [ipfsHash],
            timestamp: Date.now()
        });
        // Create event in database
        const event = new Event_1.EventModel({
            productId,
            stage,
            submitter,
            metadata: {
                temperature: temperature ? parseFloat(temperature) : undefined,
                notes,
                location: latitude && longitude ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : undefined
            },
            ipfsHash,
            transactionHash,
            aiVerified: 'pending'
        });
        const savedEvent = await event.save();
        // Update or create product
        await product_1.ProductModel.findOneAndUpdate({ productId }, {
            productId,
            batchId: `batch_${productId}`,
            currentStage: stage,
            lastUpdated: new Date(),
            submitter,
            $inc: { eventsCount: 1 }
        }, { upsert: true, new: true });
        // Trigger AI verification
        (0, aiService_1.triggerAIVerification)(String(savedEvent._id), [ipfsHash]);
        res.status(201).json({
            message: 'Event submitted successfully',
            eventId: savedEvent._id,
            transactionHash,
            ipfsHash,
            aiVerified: 'pending'
        });
    }
    catch (error) {
        console.error('Error submitting event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.submitEvent = submitEvent;
const getProductEvents = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            res.status(400).json({ error: 'Product ID is required' });
            return;
        }
        const events = await Event_1.EventModel.find({ productId }).sort({ timestamp: -1 });
        // Return direct array to match frontend expectations
        res.json(events.map(event => ({
            _id: event._id,
            productId: event.productId,
            stage: event.stage,
            submitter: event.submitter,
            timestamp: event.timestamp,
            metadata: event.metadata,
            ipfsHash: event.ipfsHash,
            transactionHash: event.transactionHash,
            aiVerified: event.aiVerified
        })));
    }
    catch (error) {
        console.error('Error fetching product events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProductEvents = getProductEvents;
//# sourceMappingURL=eventController.js.map