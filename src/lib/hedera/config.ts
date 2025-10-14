/**
 * Hedera Network Configuration
 * Testnet setup with plans to move to mainnet
 */

export const HEDERA_CONFIG = {
  network: process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
  operatorId: process.env.NEXT_PUBLIC_HEDERA_OPERATOR_ID || '',
  operatorKey: process.env.NEXT_PUBLIC_HEDERA_OPERATOR_KEY || '',
  rpcUrl: process.env.NEXT_PUBLIC_HEDERA_RPC_URL || 'https://testnet.hashio.io/api',
  mirrorNodeUrl: 'https://testnet.mirrornode.hedera.com',
  chainId: 296, // Hedera Testnet Chain ID
};

export const CONTRACT_ADDRESSES = {
  escrow: process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || '',
  lifeToken: process.env.NEXT_PUBLIC_LIFE_TOKEN_ADDRESS || '',
};

export const PLATFORM_CONFIG = {
  platformFeePercent: 2.5, // 2.5% platform fee
  minimumBountyAmount: 1, // 1 HBAR minimum
  milestoneStakingAmount: 10, // 10 $LIFE for milestone staking
};

// Hedera Testnet Explorer
export const getExplorerUrl = (type: 'account' | 'transaction' | 'token', id: string) => {
  const baseUrl = 'https://hashscan.io/testnet';
  switch (type) {
    case 'account':
      return `${baseUrl}/account/${id}`;
    case 'transaction':
      return `${baseUrl}/transaction/${id}`;
    case 'token':
      return `${baseUrl}/token/${id}`;
    default:
      return baseUrl;
  }
};
