import { Request, Response } from 'express';
import VerificationResult from '../models/VerificationResult';
import { EventModel } from '../models/Event';

export const getVerificationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      res.status(400).json({ error: 'Event ID is required' });
      return;
    }

    // Get verification result
    const verificationResult = await VerificationResult.findOne({ eventId });
    
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
  } catch (error) {
    console.error('Error fetching verification status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const handleAICallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, status, aiAnalysis } = req.body;

    if (!eventId || !status) {
      res.status(400).json({ error: 'Missing required fields: eventId and status' });
      return;
    }

    // Update verification result
    const verificationResult = await VerificationResult.findOneAndUpdate(
      { eventId },
      {
        status,
        aiAnalysis: aiAnalysis || 'AI verification completed',
        timestamp: new Date()
      },
      { upsert: true, new: true }
    );

    // Update event verification status
    await EventModel.findByIdAndUpdate(eventId, {
      aiVerified: status
    });

    res.json({
      message: 'Verification status updated successfully',
      eventId,
      status: verificationResult.status
    });
  } catch (error) {
    console.error('Error handling AI callback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
