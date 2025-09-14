import express from 'express';
import { submitEvent, getProductEvents } from '../controllers/eventController';

const router = express.Router();

// Submit a new event (multer is configured in app.ts)
router.post('/', submitEvent);

// Get all events for a product
router.get('/product/:productId', getProductEvents);

export default router;