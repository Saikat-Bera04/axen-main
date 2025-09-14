import { ethers } from 'ethers';

let provider: ethers.JsonRpcProvider;
let wallet: ethers.Wallet;

export const initBlockchain = async (): Promise<void> => {
  try {
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    
    if (!rpcUrl || !privateKey) {
      console.log('⚠️ Blockchain configuration missing, running in development mode');
      return;
    }
    
    provider = new ethers.JsonRpcProvider(rpcUrl);
    wallet = new ethers.Wallet(privateKey, provider);
    
    // Test connection
    const network = await provider.getNetwork();
    console.log('✅ Connected to blockchain network:', network.name);
    
  } catch (error) {
    console.error('❌ Failed to initialize blockchain:', error);
    console.log('⚠️ Running without blockchain integration');
  }
};

export const getProvider = (): ethers.JsonRpcProvider => {
  return provider;
};

export const getWallet = (): ethers.Wallet => {
  return wallet;
};