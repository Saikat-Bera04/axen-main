"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAICallback = exports.getVerificationStatus = void 0;
const VerificationResult_1 = __importDefault(require("../models/VerificationResult"));
const Event_1 = require("../models/Event");
const getVerificationStatus = async (req, res) => {
    try {
        const { eventId } = req.params;
        if (!eventId) {
            res.status(400).json({ error: 'Event ID is required' });
            return;
        }
        // Get verification result
        const verificationResult = await VerificationResult_1.default.findOne({ eventId });
        if (!verificationResult) {
            res.status(404).json({ error: 'Verification result not found' });
            return;
        }
        res.json({
            eventId,
            status: verificationResult.status,
            aiAnalysis: verificationResult.aiAnalysis,
            timestamp: verificationResult.timestamp
        });
    }
    catch (error) {
        console.error('Error fetching verification status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getVerificationStatus = getVerificationStatus;
const handleAICallback = async (req, res) => {
    try {
        const { eventId, status, aiAnalysis } = req.body;
        if (!eventId || !status) {
            res.status(400).json({ error: 'Missing required fields: eventId and status' });
            return;
        }
        // Update verification result
        const verificationResult = await VerificationResult_1.default.findOneAndUpdate({ eventId }, {
            status,
            aiAnalysis: aiAnalysis || 'AI verification completed',
            timestamp: new Date()
        }, { upsert: true, new: true });
        // Update event verification status
        await Event_1.EventModel.findByIdAndUpdate(eventId, {
            aiVerified: status
        });
        res.json({
            message: 'Verification status updated successfully',
            eventId,
            status: verificationResult.status
        });
    }
    catch (error) {
        console.error('Error handling AI callback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.handleAICallback = handleAICallback;
//# sourceMappingURL=verificationController.js.map