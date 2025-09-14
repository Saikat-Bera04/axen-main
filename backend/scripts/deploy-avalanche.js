const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function deployToAvalanche() {
    try {
        // Load environment variables
        require('dotenv').config();
        
        const rpcUrl = process.env.BLOCKCHAIN_TESTNET_RPC_URL || process.env.BLOCKCHAIN_RPC_URL;
        const privateKey = process.env.PRIVATE_KEY;
        
        if (!rpcUrl || !privateKey || privateKey === 'your_core_wallet_private_key_here') {
            console.log('❌ Missing RPC URL or private key in .env file');
            return;
        }
        
        // Connect to Avalanche network
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const wallet = new ethers.Wallet(privateKey, provider);
        
        console.log('🔗 Connected to Avalanche network');
        console.log('📍 Deployer address:', wallet.address);
        
        // Check balance
        const balance = await provider.getBalance(wallet.address);
        console.log('💰 Balance:', ethers.formatEther(balance), 'AVAX');
        
        if (balance === 0n) {
            console.log('❌ Insufficient AVAX balance for deployment');
            console.log('💡 Get testnet AVAX from: https://faucet.avax.network/');
            return;
        }
        
        // Read contract source
        const contractPath = path.join(__dirname, '../contracts/SupplyChain.sol');
        const contractSource = fs.readFileSync(contractPath, 'utf8');
        
        console.log('📄 Contract loaded from:', contractPath);
        
        // For deployment, you would typically use Hardhat or Foundry
        // This is a simplified example showing the connection setup
        console.log('✅ Ready for deployment!');
        console.log('📝 Next steps:');
        console.log('   1. Install Hardhat: npm install --save-dev hardhat');
        console.log('   2. Initialize Hardhat project: npx hardhat init');
        console.log('   3. Configure hardhat.config.js for Avalanche');
        console.log('   4. Deploy using: npx hardhat run scripts/deploy.js --network avalanche');
        
    } catch (error) {
        console.error('❌ Deployment error:', error.message);
    }
}

// Hardhat configuration example for Avalanche
const hardhatConfig = `
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    avalanche: {
      url: process.env.BLOCKCHAIN_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 43114
    },
    fuji: {
      url: process.env.BLOCKCHAIN_TESTNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 43113
    }
  }
};
`;

console.log('🚀 Avalanche Deployment Script');
console.log('===============================');

if (require.main === module) {
    deployToAvalanche();
}

module.exports = { deployToAvalanche, hardhatConfig };
