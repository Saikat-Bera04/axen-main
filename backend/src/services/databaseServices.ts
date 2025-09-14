import mongoose from 'mongoose';
import { EventModel } from '../models/Event';
import { ProductModel } from '../models/product';

export const saveEventToDatabase = async (eventData: any) => {
  try {
    const event = new EventModel(eventData);
    return await event.save();
  } catch (error) {
    console.error('Error saving event to database:', error);
    throw new Error('Failed to save event to database');
  }
};

export const updateEventVerification = async (eventId: string, verified: boolean, verificationData: any) => {
  try {
    return await EventModel.findByIdAndUpdate(
      eventId,
      {
        verified,
        verificationData,
        verifiedAt: new Date()
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating event verification:', error);
    throw new Error('Failed to update event verification');
  }
};

export const getEventsFromDatabase = async (productId: string) => {
  try {
    return await EventModel.find({ productId }).sort({ timestamp: 1 });
  } catch (error) {
    console.error('Error fetching events from database:', error);
    throw new Error('Failed to fetch events from database');
  }
};