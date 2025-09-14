import { ethers } from 'ethers';
import { EventData } from '../types';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate environment variables and create Avalanche provider/wallet safely
const createBlockchainConnection = () => {
  try {
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
    const testnetRpcUrl = process.env.BLOCKCHAIN_TESTNET_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const networkName = process.env.NETWORK_NAME || 'avalanche';
    const chainId = parseInt(process.env.CHAIN_ID || '43114');
    
    if (!rpcUrl || !privateKey || privateKey === 'your_core_wallet_private_key_here') {
      console.log('⚠️  Avalanche blockchain service running in mock mode - invalid or missing credentials');
      return null;
    }
    
    // Validate private key format (should be 64 hex characters, optionally prefixed with 0x)
    const cleanPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    if (!/^0x[a-fA-F0-9]{64}$/.test(cleanPrivateKey)) {
      console.log('⚠️  Invalid private key format - Avalanche blockchain service running in mock mode');
      return null;
    }
    
    // Use testnet for development, mainnet for production
    const selectedRpcUrl = process.env.NODE_ENV === 'production' ? rpcUrl : (testnetRpcUrl || rpcUrl);
    const selectedChainId = process.env.NODE_ENV === 'production' ? chainId : parseInt(process.env.TESTNET_CHAIN_ID || '43113');
    
    const provider = new ethers.JsonRpcProvider(selectedRpcUrl, {
      name: networkName,
      chainId: selectedChainId
    });
    const wallet = new ethers.Wallet(cleanPrivateKey, provider);
    
    console.log(`🔗 Connected to Avalanche ${process.env.NODE_ENV === 'production' ? 'Mainnet' : 'Testnet'} (Chain ID: ${selectedChainId})`);
    
    return { provider, wallet, chainId: selectedChainId };
  } catch (error) {
    console.log('⚠️  Failed to initialize Avalanche connection - running in mock mode:', (error as Error).message);
    return null;
  }
};

const blockchainConnection = createBlockchainConnection();

// Contract ABI - simplified for this implementation
const contractABI = [
  "function addEvent(string memory productId, string memory stage, string memory actorId, uint256 timestamp, string[] memory evidenceHashes) public returns (uint256)",
  "function getProductEvents(string memory productId) public view returns (tuple(uint256 id, string productId, string stage, string actorId, uint256 timestamp, string[] evidenceHashes)[])"
];

export async function addEventToBlockchain(eventData: EventData & { evidenceHashes: string[]; timestamp: number }): Promise<string> {
  try {
    if (!blockchainConnection) {
      console.log('🔄 Mock Avalanche transaction for:', eventData.productId);
      return `0x${Math.random().toString(16).substr(2, 64)}`;
    }
    
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, contractABI, blockchainConnection.wallet);
    
    // Add gas estimation for Avalanche network
    const gasEstimate = await contract.addEvent.estimateGas(
      eventData.productId,
      eventData.stage,
      eventData.actorId,
      eventData.timestamp,
      eventData.evidenceHashes
    );
    
    const tx = await contract.addEvent(
      eventData.productId,
      eventData.stage,
      eventData.actorId,
      eventData.timestamp,
      eventData.evidenceHashes,
      {
        gasLimit: gasEstimate * 120n / 100n, // Add 20% buffer
        maxFeePerGas: ethers.parseUnits('25', 'gwei'), // Avalanche typical gas price
        maxPriorityFeePerGas: ethers.parseUnits('1', 'gwei')
      }
    );
    
    console.log(`⛓️  Avalanche transaction submitted: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ Avalanche transaction confirmed: ${tx.hash}`);
    return tx.hash;
  } catch (error) {
    console.error('Avalanche blockchain error:', error);
    // For development, return a mock transaction hash
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  }
}

export async function getEventsFromBlockchain(productId: string): Promise<any[]> {
  try {
    if (!blockchainConnection) {
      console.log('🔄 Mock Avalanche fetch for:', productId);
      return [];
    }
    
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, contractABI, blockchainConnection.provider);
    const events = await contract.getProductEvents(productId);
    console.log(`📖 Retrieved ${events.length} events from Avalanche for product: ${productId}`);
    return events;
  } catch (error) {
    console.error('Avalanche fetch error:', error);
    return [];
  }
}
