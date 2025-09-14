import { Request, Response } from 'express';
import { EventModel } from '../models/Event';
import { ProductModel } from '../models/product';
import { uploadToIPFS } from '../services/ipfsService';
import { addEventToBlockchain } from '../services/blockchainService';
import { triggerAIVerification } from '../services/aiService';

export const submitEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, stage, submitter, temperature, notes, latitude, longitude } = req.body;
    const files = req.files as Express.Multer.File[];

    // Validate required fields
    if (!productId || !stage || !submitter) {
      res.status(400).json({ error: 'Missing required fields: productId, stage, and submitter' });
      return;
    }

    // Upload files to IPFS
    let ipfsHash = '';
    if (files && files.length > 0) {
      ipfsHash = await uploadToIPFS(files[0]);
    } else {
      // Create a metadata-only IPFS entry
      const metadata = { productId, stage, submitter, temperature, notes, location: { lat: latitude, lng: longitude } };
      ipfsHash = `metadata_${Date.now()}`;
    }

    // Add to blockchain
    const transactionHash = await addEventToBlockchain({
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
    const event = new EventModel({
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
    await ProductModel.findOneAndUpdate(
      { productId },
      {
        productId,
        batchId: `batch_${productId}`,
        currentStage: stage,
        lastUpdated: new Date(),
        submitter,
        $inc: { eventsCount: 1 }
      },
      { upsert: true, new: true }
    );

    // Trigger AI verification
    triggerAIVerification(String(savedEvent._id), [ipfsHash]);

    res.status(201).json({
      message: 'Event submitted successfully',
      eventId: savedEvent._id,
      transactionHash,
      ipfsHash,
      aiVerified: 'pending'
    });
  } catch (error) {
    console.error('Error submitting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    if (!productId) {
      res.status(400).json({ error: 'Product ID is required' });
      return;
    }

    const events = await EventModel.find({ productId }).sort({ timestamp: -1 });
    
    res.json({
      productId,
      events: events.map(event => ({
        id: event._id,
        stage: event.stage,
        submitter: event.submitter,
        timestamp: event.timestamp,
        metadata: event.metadata,
        ipfsHash: event.ipfsHash,
        transactionHash: event.transactionHash,
        aiVerified: event.aiVerified
      }))
    });
  } catch (error) {
    console.error('Error fetching product events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};