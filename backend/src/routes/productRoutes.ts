import express from 'express';
import { getProduct, createProduct, getProducts } from '../controllers/productController';

const router = express.Router();

// Get all products
router.get('/', getProducts);

// Get a specific product
router.get('/:productId', getProduct);

// Create a new product
router.post('/', createProduct);

export default router;