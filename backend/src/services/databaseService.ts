import { EventModel } from '../models/Event';
import { ProductModel } from '../models/product';
import { EventData } from '../types/index';

export async function saveEventToDatabase(eventData: EventData & { 
  evidenceHashes: string[]; 
  txHash: string; 
  verified: boolean;
}): Promise<any> {
  try {
    const event = new EventModel({
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
    await ProductModel.findOneAndUpdate(
      { productId: eventData.productId },
      {
        $set: {
          batchId: eventData.productId,
          currentStage: eventData.stage,
          lastUpdated: new Date(),
          submitter: eventData.actorId,
          verificationStatus: 'pending'
        },
        $inc: { eventsCount: 1 }
      },
      { upsert: true, new: true }
    );

    return savedEvent;
  } catch (error) {
    console.error('Database save error:', error);
    throw error;
  }
}

export async function getEventsFromDatabase(productId: string): Promise<any[]> {
  try {
    const events = await EventModel.find({ productId }).sort({ timestamp: 1 });
    return events;
  } catch (error) {
    console.error('Database fetch error:', error);
    throw error;
  }
}

export async function updateEventVerification(eventId: string, status: 'verified' | 'failed' | 'pending'): Promise<void> {
  try {
    await EventModel.findByIdAndUpdate(eventId, { aiVerified: status });
    
    // Update product verification status
    const event = await EventModel.findById(eventId);
    if (event) {
      await ProductModel.findOneAndUpdate(
        { productId: event.productId },
        { verificationStatus: status }
      );
    }
  } catch (error) {
    console.error('Verification update error:', error);
    throw error;
  }
}
