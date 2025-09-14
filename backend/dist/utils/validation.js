"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAIVerification = exports.validateProductData = exports.validateEventData = void 0;
// Validate event submission
const validateEventData = (data) => {
    const errors = [];
    if (!data.productId || typeof data.productId !== 'string') {
        errors.push('Valid productId is required');
    }
    if (!data.stage || !['farm', 'warehouse', 'store', 'customer'].includes(data.stage)) {
        errors.push('Valid stage is required (farm, warehouse, store, customer)');
    }
    if (!data.actorId || typeof data.actorId !== 'string') {
        errors.push('Valid actorId is required');
    }
    if (!data.actorType || !['farm', 'warehouse', 'store', 'customer'].includes(data.actorType)) {
        errors.push('Valid actorType is required (farm, warehouse, store, customer)');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateEventData = validateEventData;
// Validate product data
const validateProductData = (data) => {
    const errors = [];
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Valid product name is required');
    }
    if (data.description && typeof data.description !== 'string') {
        errors.push('Description must be a string');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateProductData = validateProductData;
// Validate AI verification result
const validateAIVerification = (data) => {
    const errors = [];
    if (!data.eventId || typeof data.eventId !== 'string') {
        errors.push('Valid eventId is required');
    }
    if (!data.verificationData || typeof data.verificationData !== 'object') {
        errors.push('Valid verificationData is required');
    }
    if (!data.ipfsHash || typeof data.ipfsHash !== 'string') {
        errors.push('Valid ipfsHash is required');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateAIVerification = validateAIVerification;
//# sourceMappingURL=validation.js.map