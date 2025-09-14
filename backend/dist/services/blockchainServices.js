"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsFromBlockchain = exports.verifyEventOnBlockchain = exports.addEventToBlockchain = void 0;
const ethers_1 = require("ethers");
const SupplyChain_json_1 = __importDefault(require("../contracts/SupplyChain.json"));
const provider = new ethers_1.ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
const wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers_1.ethers.Contract(contractAddress, SupplyChain_json_1.default.abi, wallet);
const addEventToBlockchain = async (eventData) => {
    try {
        const tx = await contract.addEvent(eventData.productId, eventData.stage, eventData.actorId, eventData.evidenceHashes, eventData.timestamp);
        await tx.wait();
        return tx.hash;
    }
    catch (error) {
        console.error('Error adding event to blockchain:', error);
        throw new Error('Failed to add event to blockchain');
    }
};
exports.addEventToBlockchain = addEventToBlockchain;
const verifyEventOnBlockchain = async (eventId, verified, verificationHash) => {
    try {
        const tx = await contract.verifyEvent(eventId, verified, verificationHash);
        await tx.wait();
        return tx.hash;
    }
    catch (error) {
        console.error('Error verifying event on blockchain:', error);
        throw new Error('Failed to verify event on blockchain');
    }
};
exports.verifyEventOnBlockchain = verifyEventOnBlockchain;
const getEventsFromBlockchain = async (productId) => {
    try {
        const events = await contract.getEvents(productId);
        return events;
    }
    catch (error) {
        console.error('Error fetching events from blockchain:', error);
        throw new Error('Failed to fetch events from blockchain');
    }
};
exports.getEventsFromBlockchain = getEventsFromBlockchain;
//# sourceMappingURL=blockchainServices.js.map