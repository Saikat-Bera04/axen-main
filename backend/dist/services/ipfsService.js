"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToIPFS = uploadToIPFS;
exports.uploadJSONToIPFS = uploadJSONToIPFS;
exports.getFromIPFS = getFromIPFS;
// IPFS client configuration - commented out for development
// const ipfs = create({
//   host: process.env.IPFS_HOST || 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: process.env.INFURA_PROJECT_ID && process.env.INFURA_PROJECT_SECRET 
//       ? `Basic ${Buffer.from(`${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_PROJECT_SECRET}`).toString('base64')}`
//       : undefined
//   }
// });
// Simple IPFS service with fallback for development
async function uploadToIPFS(file) {
    try {
        // For development, return a mock IPFS hash
        // In production, this would integrate with actual IPFS
        const mockHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
        console.log(` Mock IPFS upload: ${file.originalname} -> ${mockHash}`);
        return mockHash;
    }
    catch (error) {
        console.error('IPFS upload error:', error);
        return `Qm${Math.random().toString(36).substr(2, 44)}`;
    }
}
async function uploadJSONToIPFS(data) {
    try {
        // For development, return a mock IPFS hash
        const mockHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
        console.log(` Mock IPFS JSON upload -> ${mockHash}`);
        return mockHash;
    }
    catch (error) {
        console.error('IPFS JSON upload error:', error);
        return `Qm${Math.random().toString(36).substr(2, 44)}`;
    }
}
async function getFromIPFS(hash) {
    try {
        console.log(` Mock IPFS retrieval: ${hash}`);
        return { message: 'Mock IPFS data', hash };
    }
    catch (error) {
        console.error('IPFS retrieval error:', error);
        throw error;
    }
}
//# sourceMappingURL=ipfsService.js.map