"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVerificationResult = exports.triggerAIVerification = void 0;
const axios_1 = __importDefault(require("axios"));
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';
const triggerAIVerification = async (eventId, evidenceHashes) => {
    try {
        // This is an async call - we don't wait for the response
        axios_1.default.post(`${AI_SERVICE_URL}/verify`, {
            eventId,
            evidenceHashes
        }, {
            timeout: 5000 // Short timeout since we're not waiting for the result
        }).catch(error => {
            console.error('Error triggering AI verification:', error);
        });
    }
    catch (error) {
        console.error('Error triggering AI verification:', error);
    }
};
exports.triggerAIVerification = triggerAIVerification;
const getVerificationResult = async (eventId) => {
    try {
        const response = await axios_1.default.get(`${AI_SERVICE_URL}/results/${eventId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching verification result:', error);
        throw new Error('Failed to fetch verification result');
    }
};
exports.getVerificationResult = getVerificationResult;
//# sourceMappingURL=aiServices.js.map