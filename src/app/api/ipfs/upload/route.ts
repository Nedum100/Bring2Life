/**
 * IPFS Upload API Route
 * Handle file uploads to Pinata IPFS
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToPinata, uploadJSONToPinata } from '@/lib/ipfs/pinata';

// POST /api/ipfs/upload - Upload file to IPFS
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'file' or 'json'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    let cid: string;

    if (type === 'json') {
      const text = await file.text();
      const json = JSON.parse(text);
      cid = await uploadJSONToPinata(json, file.name);
    } else {
      cid = await uploadFileToPinata(file, file.name);
    }

    return NextResponse.json({
      success: true,
      data: {
        cid,
        url: `https://gateway.pinata.cloud/ipfs/${cid}`,
        filename: file.name,
        size: file.size,
      },
    });
  } catch (error: any) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
