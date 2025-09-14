"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supply-chain';
class Database {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect() {
        if (this.isConnected && mongoose_1.default.connection.readyState === 1) {
            console.log('📊 Already connected to MongoDB');
            return;
        }
        try {
            // Disconnect if there's an existing connection
            if (mongoose_1.default.connection.readyState !== 0) {
                await mongoose_1.default.disconnect();
            }
            await mongoose_1.default.connect(MONGODB_URI, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 10000,
                heartbeatFrequencyMS: 10000,
                maxIdleTimeMS: 30000,
            });
            this.isConnected = true;
            console.log('✅ Connected to MongoDB successfully');
            // Set up event listeners only once
            mongoose_1.default.connection.removeAllListeners('error');
            mongoose_1.default.connection.removeAllListeners('disconnected');
            mongoose_1.default.connection.removeAllListeners('reconnected');
            mongoose_1.default.connection.on('error', (error) => {
                console.error('❌ MongoDB connection error:', error);
                this.isConnected = false;
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.log('⚠️ MongoDB disconnected, attempting to reconnect...');
                this.isConnected = false;
                // Auto-reconnect after 5 seconds
                setTimeout(() => {
                    if (!this.isConnected) {
                        this.connect().catch(console.error);
                    }
                }, 5000);
            });
            mongoose_1.default.connection.on('reconnected', () => {
                console.log('✅ MongoDB reconnected successfully');
                this.isConnected = true;
            });
        }
        catch (error) {
            console.error('❌ Failed to connect to MongoDB:', error);
            this.isConnected = false;
            // Don't throw error, fall back to mock mode
            console.log('🔄 Falling back to mock mode');
        }
    }
    async disconnect() {
        if (!this.isConnected) {
            return;
        }
        try {
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            console.log('🔌 Disconnected from MongoDB');
        }
        catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error);
            throw error;
        }
    }
    getConnectionStatus() {
        return this.isConnected && mongoose_1.default.connection.readyState === 1;
    }
}
exports.database = Database.getInstance();
//# sourceMappingURL=database.js.map