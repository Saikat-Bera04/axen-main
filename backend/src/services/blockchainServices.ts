import { ethers } from 'ethers';
import SupplyChainABI from '../contracts/SupplyChain.json';

const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

const contractAddress = process.env.CONTRACT_ADDRESS as string;
const contract = new ethers.Contract(contractAddress, SupplyChainABI.abi, wallet);

export const addEventToBlockchain = async (eventData: {
  productId: string;
  stage: string;
  actorId: string;
  evidenceHashes: string[];
  timestamp: number;
}): Promise<string> => {
  try {
    const tx = await contract.addEvent(
      eventData.productId,
      eventData.stage,
      eventData.actorId,
      eventData.evidenceHashes,
      eventData.timestamp
    );
    
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error adding event to blockchain:', error);
    throw new Error('Failed to add event to blockchain');
  }
};

export const verifyEventOnBlockchain = async (eventId: string, verified: boolean, verificationHash: string): Promise<string> => {
  try {
    const tx = await contract.verifyEvent(eventId, verified, verificationHash);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error verifying event on blockchain:', error);
    throw new Error('Failed to verify event on blockchain');
  }
};

export const getEventsFromBlockchain = async (productId: string): Promise<any[]> => {
  try {
    const events = await contract.getEvents(productId);
    return events;
  } catch (error) {
    console.error('Error fetching events from blockchain:', error);
    throw new Error('Failed to fetch events from blockchain');
  }
};