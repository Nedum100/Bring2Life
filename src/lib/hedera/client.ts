/**
 * Hedera Client Setup
 * Provides SDK client for interacting with Hedera network
 */

import { Client, AccountId, PrivateKey } from '@hashgraph/sdk';
import { HEDERA_CONFIG } from './config';

let client: Client | null = null;

/**
 * Initialize Hedera client for testnet
 */
export const getHederaClient = (): Client => {
  if (client) {
    return client;
  }

  if (!HEDERA_CONFIG.operatorId || !HEDERA_CONFIG.operatorKey) {
    throw new Error('Hedera operator credentials not configured');
  }

  try {
    // Create client for testnet
    client = Client.forTestnet();

    // Set operator account
    client.setOperator(
      AccountId.fromString(HEDERA_CONFIG.operatorId),
      PrivateKey.fromStringECDSA(HEDERA_CONFIG.operatorKey)
    );

    // Set default max transaction fee (2 HBAR)
    client.setDefaultMaxTransactionFee(200000000);

    // Set max query payment (1 HBAR)
    client.setDefaultMaxQueryPayment(100000000);

    console.log('✅ Hedera client initialized for testnet');
    return client;
  } catch (error) {
    console.error('Failed to initialize Hedera client:', error);
    throw error;
  }
};

/**
 * Close the Hedera client connection
 */
export const closeHederaClient = () => {
  if (client) {
    client.close();
    client = null;
  }
};

/**
 * Validate Hedera account ID format
 */
export const isValidAccountId = (accountId: string): boolean => {
  try {
    AccountId.fromString(accountId);
    return true;
  } catch {
    return false;
  }
};

/**
 * Convert HBAR to tinybars (1 HBAR = 100,000,000 tinybars)
 */
export const hbarToTinybars = (hbar: number): number => {
  return Math.floor(hbar * 100000000);
};

/**
 * Convert tinybars to HBAR
 */
export const tinybarsToHbar = (tinybars: number): number => {
  return tinybars / 100000000;
};
