"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const EventSchema = new mongoose_1.Schema({
    productId: {
        type: String,
        required: true,
        index: true
    },
    stage: {
        type: String,
        required: true,
        enum: ['farm', 'warehouse', 'store', 'customer']
    },
    submitter: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    metadata: {
        temperature: {
            type: Number
        },
        notes: {
            type: String
        },
        location: {
            lat: {
                type: Number
            },
            lng: {
                type: Number
            }
        }
    },
    ipfsHash: {
        type: String,
        required: true
    },
    aiVerified: {
        type: String,
        enum: ['verified', 'failed', 'pending'],
        default: 'pending'
    },
    transactionHash: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
// Compound index for efficient queries
EventSchema.index({ productId: 1, timestamp: 1 });
exports.EventModel = mongoose_1.default.model('Event', EventSchema);
//# sourceMappingURL=Event.js.map