/**
 * Pinata IPFS Service
 * Handles file and JSON uploads to IPFS via Pinata
 */

import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
const PINATA_SECRET = process.env.PINATA_API_SECRET!;
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud';

if (!PINATA_API_KEY || !PINATA_SECRET) {
  console.warn('Pinata credentials not configured');
}

/**
 * Upload file to Pinata IPFS
 */
export async function uploadFileToPinata(file: File | Blob, filename?: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file, filename);

    const metadata = JSON.stringify({
      name: filename || 'Bring2Life Upload',
    });
    formData.append('pinataMetadata', metadata);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error: any) {
    console.error('Error uploading to Pinata:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Upload JSON to Pinata IPFS
 */
export async function uploadJSONToPinata(json: object, name?: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      json,
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET,
        },
        params: {
          pinataMetadata: JSON.stringify({
            name: name || 'Bring2Life JSON',
          }),
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error: any) {
    console.error('Error uploading JSON to Pinata:', error);
    throw new Error(`Failed to upload JSON: ${error.message}`);
  }
}

/**
 * Get IPFS URL from CID
 */
export function getIPFSUrl(cid: string): string {
  return `${PINATA_GATEWAY}/ipfs/${cid}`;
}

/**
 * Unpin file from Pinata (cleanup)
 */
export async function unpinFromPinata(cid: string): Promise<boolean> {
  try {
    await axios.delete(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET,
      },
    });

    return true;
  } catch (error: any) {
    console.error('Error unpinning from Pinata:', error);
    return false;
  }
}
