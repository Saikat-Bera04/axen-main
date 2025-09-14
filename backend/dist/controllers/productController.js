"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const product_1 = require("../models/product");
const Event_1 = require("../models/Event");
const getProducts = async (req, res) => {
    try {
        const products = await product_1.ProductModel.find().sort({ lastUpdated: -1 });
        // Return direct array to match frontend expectations
        res.json(products.map(product => ({
            _id: product._id,
            productId: product.productId,
            batchId: product.batchId,
            currentStage: product.currentStage,
            lastUpdated: product.lastUpdated,
            verificationStatus: product.verificationStatus,
            eventsCount: product.eventsCount,
            submitter: product.submitter
        })));
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProducts = getProducts;
const getProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            res.status(400).json({ error: 'Product ID is required' });
            return;
        }
        const product = await product_1.ProductModel.findOne({ productId });
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        // Get recent events for this product
        const recentEvents = await Event_1.EventModel.find({ productId })
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
    }
    catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProduct = getProduct;
const createProduct = async (req, res) => {
    try {
        const { productId, batchId, submitter } = req.body;
        if (!productId || !batchId || !submitter) {
            res.status(400).json({ error: 'Missing required fields: productId, batchId, and submitter' });
            return;
        }
        // Check if product already exists
        const existingProduct = await product_1.ProductModel.findOne({ productId });
        if (existingProduct) {
            res.status(409).json({ error: 'Product already exists' });
            return;
        }
        const product = new product_1.ProductModel({
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
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createProduct = createProduct;
//# sourceMappingURL=productController.js.map