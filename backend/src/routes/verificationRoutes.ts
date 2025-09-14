import express from 'express';
import { getVerificationStatus, handleAICallback } from '../controllers/verificationController';

const router = express.Router();

// Get verification status for an event
router.get('/event/:eventId', getVerificationStatus);

// Callback endpoint for AI service to post verification results
router.post('/callback', handleAICallback);

export default router;