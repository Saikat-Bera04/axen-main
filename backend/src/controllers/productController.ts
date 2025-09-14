import { Request, Response } from 'express';
import { ProductModel } from '../models/product';
import { EventModel } from '../models/Event';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await ProductModel.find().sort({ lastUpdated: -1 });
    
    res.json({
      products: products.map(product => ({
        productId: product.productId,
        batchId: product.batchId,
        currentStage: product.currentStage,
        lastUpdated: product.lastUpdated,
        verificationStatus: product.verificationStatus,
        eventsCount: product.eventsCount,
        submitter: product.submitter
      }))
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    if (!productId) {
      res.status(400).json({ error: 'Product ID is required' });
      return;
    }

    const product = await ProductModel.findOne({ productId });
    
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Get recent events for this product
    const recentEvents = await EventModel.find({ productId })
      .sort({ timestamp: -1 })
      .limit(5);

    res.json({
      productId: product.productId,
      batchId: product.batchId,
      currentStage: product.currentStage,
      lastUpdated: product.lastUpdated,
      verificationStatus: product.verificationStatus,
      eventsCount: product.eventsCount,
      submitter: product.submitter,
      recentEvents: recentEvents.map(event => ({
        id: event._id,
        stage: event.stage,
        submitter: event.submitter,
        timestamp: event.timestamp,
        aiVerified: event.aiVerified
      }))
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, batchId, submitter } = req.body;

    if (!productId || !batchId || !submitter) {
      res.status(400).json({ error: 'Missing required fields: productId, batchId, and submitter' });
      return;
    }

    // Check if product already exists
    const existingProduct = await ProductModel.findOne({ productId });
    if (existingProduct) {
      res.status(409).json({ error: 'Product already exists' });
      return;
    }

    const product = new ProductModel({
      productId,
      batchId,
      submitter,
      currentStage: 'farm',
      verificationStatus: 'pending',
      eventsCount: 0
    });

    const savedProduct = await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product: {
        productId: savedProduct.productId,
        batchId: savedProduct.batchId,
        currentStage: savedProduct.currentStage,
        verificationStatus: savedProduct.verificationStatus,
        submitter: savedProduct.submitter
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};