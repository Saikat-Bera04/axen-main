"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateScore = exports.formatDate = exports.isValidGPS = exports.generateProductId = exports.bufferToStream = void 0;
const stream_1 = require("stream");
// Convert buffer to stream
const bufferToStream = (buffer) => {
    return stream_1.Readable.from(buffer);
};
exports.bufferToStream = bufferToStream;
// Generate unique product ID
const generateProductId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `prod_${timestamp}_${randomStr}`;
};
exports.generateProductId = generateProductId;
// Validate GPS coordinates
const isValidGPS = (lat, lng) => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};
exports.isValidGPS = isValidGPS;
// Format date for display
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};
exports.formatDate = formatDate;
// Calculate verification score
const calculateScore = (verificationData) => {
    let score = 0;
    if (verificationData.imageClassification?.isValid)
        score += 25;
    if (verificationData.ocrResults?.isValid)
        score += 25;
    if (verificationData.gpsValidation?.isValid)
        score += 25;
    if (!verificationData.anomalyDetection?.hasAnomalies)
        score += 25;
    return score;
};
exports.calculateScore = calculateScore;
//# sourceMappingURL=helpers.js.map