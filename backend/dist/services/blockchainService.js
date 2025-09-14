"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEventToBlockchain = addEventToBlockchain;
exports.getEventsFromBlockchain = getEventsFromBlockchain;
const ethers_1 = require("ethers");
// Validate environment variables and create provider/wallet safely
const createBlockchainConnection = () => {
    try {
        const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
        const privateKey = process.env.PRIVATE_KEY;
        if (!rpcUrl || !privateKey || privateKey === 'your_wallet_private_key_here') {
            console.log('⚠️  Blockchain service running in mock mode - invalid or missing credentials');
            return null;
        }
        // Validate private key format (should be 64 hex characters, optionally prefixed with 0x)
        const cleanPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
        if (!/^0x[a-fA-F0-9]{64}$/.test(cleanPrivateKey)) {
            console.log('⚠️  Invalid private key format - blockchain service running in mock mode');
            return null;
        }
        const provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
        const wallet = new ethers_1.ethers.Wallet(cleanPrivateKey, provider);
        return { provider, wallet };
    }
    catch (error) {
        console.log('⚠️  Failed to initialize blockchain connection - running in mock mode:', error.message);
        return null;
    }
};
const blockchainConnection = createBlockchainConnection();
// Contract ABI - simplified for this implementation
const contractABI = [
    "function addEvent(string memory productId, string memory stage, string memory actorId, uint256 timestamp, string[] memory evidenceHashes) public returns (uint256)",
    "function getProductEvents(string memory productId) public view returns (tuple(uint256 id, string productId, string stage, string actorId, uint256 timestamp, string[] evidenceHashes)[])"
];
async function addEventToBlockchain(eventData) {
    try {
        if (!blockchainConnection) {
            console.log('🔄 Mock blockchain transaction for:', eventData.productId);
            return `0x${Math.random().toString(16).substr(2, 64)}`;
        }
        const contract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, blockchainConnection.wallet);
        const tx = await contract.addEvent(eventData.productId, eventData.stage, eventData.actorId, eventData.timestamp, eventData.evidenceHashes);
        await tx.wait();
        return tx.hash;
    }
    catch (error) {
        console.error('Blockchain error:', error);
        // For development, return a mock transaction hash
        return `0x${Math.random().toString(16).substr(2, 64)}`;
    }
}
async function getEventsFromBlockchain(productId) {
    try {
        if (!blockchainConnection) {
            console.log('🔄 Mock blockchain fetch for:', productId);
            return [];
        }
        const contract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, blockchainConnection.provider);
        const events = await contract.getProductEvents(productId);
        return events;
    }
    catch (error) {
        console.error('Blockchain fetch error:', error);
        return [];
    }
}
//# sourceMappingURL=blockchainService.js.map