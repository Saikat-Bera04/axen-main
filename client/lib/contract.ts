import { ethers } from "ethers";
import SupplyChain from "@/../backend/src/contracts/SupplyChain.json";

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export function getContract(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, SupplyChain.abi, signerOrProvider);
}