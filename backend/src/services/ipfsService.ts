import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';
import * as Express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Pinata IPFS configuration
const createPinataClient = () => {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_KEY;
  const jwt = process.env.PINATA_JWT;
  
  if (!apiKey || !secretKey || apiKey === 'your_pinata_api_key_here') {
    console.log('⚠️  IPFS service running in mock mode - invalid or missing Pinata credentials');
    return null;
  }
  
  return {
    apiKey,
    secretKey,
    jwt,
    baseURL: 'https://api.pinata.cloud'
  };
};

const pinataClient = createPinataClient();

// IPFS service with Pinata integration
export async function uploadToIPFS(file: any): Promise<string> {
  try {
    if (!pinataClient) {
      // Mock mode for development
      const mockHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
      console.log(` Mock IPFS upload: ${file.originalname} -> ${mockHash}`);
      return mockHash;
    }

    // Upload to Pinata
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });

    const metadata = JSON.stringify({
      name: file.originalname,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        originalName: file.originalname
      }
    });
    formData.append('pinataMetadata', metadata);

    const response = await axios.post(
      `${pinataClient.baseURL}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'pinata_api_key': pinataClient.apiKey,
          'pinata_secret_api_key': pinataClient.secretKey
        }
      }
    );

    console.log(` Pinata IPFS upload: ${file.originalname} -> ${response.data.IpfsHash}`);
    return response.data.IpfsHash;
  } catch (error) {
    console.error('IPFS upload error:', error);
    // Fallback to mock hash
    return `Qm${Math.random().toString(36).substr(2, 44)}`;
  }
}

export async function uploadJSONToIPFS(data: any): Promise<string> {
  try {
    if (!pinataClient) {
      // Mock mode for development
      const mockHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
      console.log(` Mock IPFS JSON upload -> ${mockHash}`);
      return mockHash;
    }

    // Upload JSON to Pinata
    const response = await axios.post(
      `${pinataClient.baseURL}/pinning/pinJSONToIPFS`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': pinataClient.apiKey,
          'pinata_secret_api_key': pinataClient.secretKey
        }
      }
    );

    console.log(` Pinata JSON upload -> ${response.data.IpfsHash}`);
    return response.data.IpfsHash;
  } catch (error) {
    console.error('IPFS JSON upload error:', error);
    return `Qm${Math.random().toString(36).substr(2, 44)}`;
  }
}

export async function getFromIPFS(hash: string): Promise<any> {
  try {
    if (!pinataClient) {
      console.log(` Mock IPFS retrieval: ${hash}`);
      return { message: 'Mock IPFS data', hash };
    }

    // Retrieve from IPFS via Pinata gateway
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${hash}`);
    console.log(` Pinata IPFS retrieval: ${hash}`);
    return response.data;
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw error;
  }
}