"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const database_1 = require("./config/database");
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
// Load environment variables first
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Initialize database connection
database_1.database.connect().catch(console.error);
// Security middleware
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3002',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});
// Health check endpoint
app.get('/health', (req, res) => {
    const dbStatus = database_1.database.getConnectionStatus();
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbStatus ? 'connected' : 'disconnected'
    });
});
// API Routes
app.use('/api/products', productRoutes_1.default);
app.use('/api/events', eventRoutes_1.default);
// Fallback mock endpoints (only if database is not connected)
app.get('/api/products', (req, res) => {
    if (database_1.database.getConnectionStatus()) {
        return res.status(500).json({ error: 'Route should be handled by productRoutes' });
    }
    res.json([
        {
            _id: '507f1f77bcf86cd799439011',
            productId: 'PROD001',
            batchId: 'BATCH-2024-001',
            currentStage: 'farm',
            lastUpdated: new Date().toISOString(),
            verificationStatus: 'verified',
            eventsCount: 3,
            submitter: 'farmer1@example.com'
        },
        {
            _id: '507f1f77bcf86cd799439012',
            productId: 'PROD002',
            batchId: 'BATCH-2024-002',
            currentStage: 'warehouse',
            lastUpdated: new Date(Date.now() - 86400000).toISOString(),
            verificationStatus: 'pending',
            eventsCount: 2,
            submitter: 'warehouse1@example.com'
        },
        {
            _id: '507f1f77bcf86cd799439013',
            productId: 'PROD003',
            batchId: 'BATCH-2024-003',
            currentStage: 'store',
            lastUpdated: new Date(Date.now() - 172800000).toISOString(),
            verificationStatus: 'failed',
            eventsCount: 4,
            submitter: 'store1@example.com'
        },
        {
            _id: '507f1f77bcf86cd799439014',
            productId: 'PROD004',
            batchId: 'BATCH-2024-004',
            currentStage: 'customer',
            lastUpdated: new Date(Date.now() - 259200000).toISOString(),
            verificationStatus: 'verified',
            eventsCount: 5,
            submitter: 'delivery1@example.com'
        }
    ]);
});
app.get('/api/events/product/:productId', (req, res) => {
    if (database_1.database.getConnectionStatus()) {
        return res.status(500).json({ error: 'Route should be handled by eventRoutes' });
    }
    const { productId } = req.params;
    res.json([
        {
            _id: 'EVENT001',
            productId: productId,
            stage: 'farm',
            submitter: 'farmer1@example.com',
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            metadata: {
                temperature: 25,
                notes: 'Fresh harvest from organic farm',
                location: { lat: 40.7128, lng: -74.0060 }
            },
            ipfsHash: 'Qm' + Math.random().toString(36).substr(2, 44),
            transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
            aiVerified: 'verified'
        },
        {
            _id: 'EVENT002',
            productId: productId,
            stage: 'warehouse',
            submitter: 'warehouse1@example.com',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            metadata: {
                temperature: 22,
                notes: 'Stored in temperature-controlled environment',
                location: { lat: 40.7589, lng: -73.9851 }
            },
            ipfsHash: 'Qm' + Math.random().toString(36).substr(2, 44),
            transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
            aiVerified: 'verified'
        },
        {
            _id: 'EVENT003',
            productId: productId,
            stage: 'store',
            submitter: 'store1@example.com',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            metadata: {
                temperature: 20,
                notes: 'Ready for customer purchase',
                location: { lat: 40.7505, lng: -73.9934 }
            },
            ipfsHash: 'Qm' + Math.random().toString(36).substr(2, 44),
            transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
            aiVerified: 'pending'
        }
    ]);
});
app.get('/api/verification/event/:eventId', (req, res) => {
    const { eventId } = req.params;
    res.json({
        eventId,
        status: 'verified',
        aiAnalysis: 'Event verified successfully',
        timestamp: new Date()
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await database_1.database.disconnect();
    process.exit(0);
});
// Start server
app.listen(PORT, () => {
    console.log('🚀 Supply Chain Backend Started!');
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API endpoints: http://localhost:${PORT}/api`);
    console.log(`📊 Database: ${database_1.database.getConnectionStatus() ? 'Connected' : 'Mock mode'}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map