"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verificationController_1 = require("../controllers/verificationController");
const router = express_1.default.Router();
// Get verification status for an event
router.get('/event/:eventId', verificationController_1.getVerificationStatus);
// Callback endpoint for AI service to post verification results
router.post('/callback', verificationController_1.handleAICallback);
exports.default = router;
//# sourceMappingURL=verificationRoutes.js.map