import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "@/lib/contract";

export function useSupplyChain() {
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      setContract(getContract(provider.getSigner()));
    }
  }, []);

  return contract;
}