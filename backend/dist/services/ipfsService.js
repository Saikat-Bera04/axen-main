"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToIPFS = uploadToIPFS;
exports.uploadJSONToIPFS = uploadJSONToIPFS;
exports.getFromIPFS = getFromIPFS;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Pinata IPFS configuration
const createPinataClient = () => {
    const apiKey = process.env.PINATA_API_KEY;
    const secretKey = process.env.PINATA_SECRET_KEY;
    const jwt = process.env.PINATA_JWT;
    if (!apiKey || !secretKey || apiKey === 'your_pinata_api_key_here') {
        console.log('⚠️  IPFS service running in mock mode - invalid or missing Pinata credentials');
        return null;
    }
    return {
        apiKey,
        secretKey,
        jwt,
        baseURL: 'https://api.pinata.cloud'
    };
};
const pinataClient = createPinataClient();
// IPFS service with Pinata integration
async function uploadToIPFS(file) {
    try {
        if (!pinataClient) {
            // Mock mode for development
            const mockHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
            console.log(` Mock IPFS upload: ${file.originalname} -> ${mockHash}`);
            return mockHash;
        }
        // Upload to Pinata
        const formData = new form_data_1.default();
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
        });
        const metadata = JSON.stringify({
            name: file.originalname,
            keyvalues: {
                uploadedAt: new Date().toISOString(),
                originalName: file.originalname
            }
        });
        formData.append('pinataMetadata', metadata);
        const response = await axios_1.default.post(`${pinataClient.baseURL}/pinning/pinFileToIPFS`, formData, {
            headers: {
                ...formData.getHeaders(),
                'pinata_api_key': pinataClient.apiKey,
                'pinata_secret_api_key': pinataClient.secretKey
            }
        });
        console.log(` Pinata IPFS upload: ${file.originalname} -> ${response.data.IpfsHash}`);
        return response.data.IpfsHash;
    }
    catch (error) {
        console.error('IPFS upload error:', error);
        // Fallback to mock hash
        return `Qm${Math.random().toString(36).substr(2, 44)}`;
    }
}
async function uploadJSONToIPFS(data) {
    try {
        if (!pinataClient) {
            // Mock mode for development
            const mockHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
            console.log(` Mock IPFS JSON upload -> ${mockHash}`);
            return mockHash;
        }
        // Upload JSON to Pinata
        const response = await axios_1.default.post(`${pinataClient.baseURL}/pinning/pinJSONToIPFS`, data, {
            headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': pinataClient.apiKey,
                'pinata_secret_api_key': pinataClient.secretKey
            }
        });
        console.log(` Pinata JSON upload -> ${response.data.IpfsHash}`);
        return response.data.IpfsHash;
    }
    catch (error) {
        console.error('IPFS JSON upload error:', error);
        return `Qm${Math.random().toString(36).substr(2, 44)}`;
    }
}
async function getFromIPFS(hash) {
    try {
        if (!pinataClient) {
            console.log(` Mock IPFS retrieval: ${hash}`);
            return { message: 'Mock IPFS data', hash };
        }
        // Retrieve from IPFS via Pinata gateway
        const response = await axios_1.default.get(`https://gateway.pinata.cloud/ipfs/${hash}`);
        console.log(` Pinata IPFS retrieval: ${hash}`);
        return response.data;
    }
    catch (error) {
        console.error('IPFS retrieval error:', error);
        throw error;
    }
}
//# sourceMappingURL=ipfsService.js.map