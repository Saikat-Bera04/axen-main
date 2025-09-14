"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWallet = exports.getProvider = exports.initBlockchain = void 0;
const ethers_1 = require("ethers");
let provider;
let wallet;
const initBlockchain = async () => {
    try {
        const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
        const privateKey = process.env.PRIVATE_KEY;
        if (!rpcUrl || !privateKey) {
            console.log('⚠️ Blockchain configuration missing, running in development mode');
            return;
        }
        provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
        wallet = new ethers_1.ethers.Wallet(privateKey, provider);
        // Test connection
        const network = await provider.getNetwork();
        console.log('✅ Connected to blockchain network:', network.name);
    }
    catch (error) {
        console.error('❌ Failed to initialize blockchain:', error);
        console.log('⚠️ Running without blockchain integration');
    }
};
exports.initBlockchain = initBlockchain;
const getProvider = () => {
    return provider;
};
exports.getProvider = getProvider;
const getWallet = () => {
    return wallet;
};
exports.getWallet = getWallet;
//# sourceMappingURL=blockchain.js.map