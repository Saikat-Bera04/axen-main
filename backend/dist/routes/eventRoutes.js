"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const eventController_1 = require("../controllers/eventController");
const router = express_1.default.Router();
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});
// Submit a new event with file upload support
router.post('/', upload.array('evidence', 10), eventController_1.submitEvent);
// Get all events for a product
router.get('/product/:productId', eventController_1.getProductEvents);
exports.default = router;
//# sourceMappingURL=eventRoutes.js.map