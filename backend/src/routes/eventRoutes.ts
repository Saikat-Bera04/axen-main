import express from 'express';
import multer from 'multer';
import { submitEvent, getProductEvents } from '../controllers/eventController';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Submit a new event with file upload support
router.post('/', upload.array('evidence', 10), submitEvent);

// Get all events for a product
router.get('/product/:productId', getProductEvents);

export default router;