/**
 * Hedera Token Service (HTS) Integration
 * Handles fungible ($LIFE) and non-fungible (NFT) token operations
 */

import {
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TokenAssociateTransaction,
  TransferTransaction,
  TokenId,
  AccountId,
  PrivateKey,
  Hbar,
  CustomRoyaltyFee,
  CustomFixedFee,
  AccountBalanceQuery,
} from '@hashgraph/sdk';
import { getHederaClient, tinybarsToHbar } from './client';
import { CONTRACT_ADDRESSES } from './config';

export interface CreateTokenParams {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  treasuryAccount: string;
  adminKey: PrivateKey;
}

export interface CreateNFTParams {
  name: string;
  symbol: string;
  treasuryAccount: string;
  supplyKey: PrivateKey;
  royaltyPercent: number; // e.g., 5 for 5%
  royaltyFallbackFee: number; // in HBAR
}

export interface MintNFTParams {
  tokenId: string;
  metadataCID: string; // IPFS CID
  supplyKey: PrivateKey;
}

/**
 * Create $LIFE fungible token
 */
export async function createLifeToken(params: CreateTokenParams): Promise<string> {
  const client = getHederaClient();

  try {
    const transaction = new TokenCreateTransaction()
      .setTokenName(params.name)
      .setTokenSymbol(params.symbol)
      .setDecimals(params.decimals)
      .setInitialSupply(params.initialSupply)
      .setTreasuryAccountId(AccountId.fromString(params.treasuryAccount))
      .setAdminKey(params.adminKey)
      .setSupplyKey(params.adminKey)
      .setFreezeDefault(false);

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const tokenId = receipt.tokenId;

    if (!tokenId) {
      throw new Error('Token creation failed - no token ID returned');
    }

    console.log(`✅ $LIFE token created: ${tokenId.toString()}`);
    return tokenId.toString();
  } catch (error) {
    console.error('Failed to create $LIFE token:', error);
    throw error;
  }
}

/**
 * Create NFT collection for certificates of authenticity
 */
export async function createNFTCollection(params: CreateNFTParams): Promise<string> {
  const client = getHederaClient();

  try {
    // Define royalty fee (percentage on secondary sales)
    const royaltyFee = new CustomRoyaltyFee()
      .setNumerator(params.royaltyPercent)
      .setDenominator(100)
      .setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(params.royaltyFallbackFee)))
      .setFeeCollectorAccountId(AccountId.fromString(params.treasuryAccount));

    const transaction = new TokenCreateTransaction()
      .setTokenName(params.name)
      .setTokenSymbol(params.symbol)
      .setTokenType(TokenType.NonFungibleUnique)
      .setSupplyType(TokenSupplyType.Infinite)
      .setTreasuryAccountId(AccountId.fromString(params.treasuryAccount))
      .setSupplyKey(params.supplyKey)
      .setCustomFees([royaltyFee])
      .setMaxTransactionFee(new Hbar(20));

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const tokenId = receipt.tokenId;

    if (!tokenId) {
      throw new Error('NFT collection creation failed');
    }

    console.log(`✅ NFT collection created: ${tokenId.toString()}`);
    return tokenId.toString();
  } catch (error) {
    console.error('Failed to create NFT collection:', error);
    throw error;
  }
}

/**
 * Mint NFT with metadata (IPFS CID)
 */
export async function mintNFT(params: MintNFTParams): Promise<number> {
  const client = getHederaClient();

  try {
    // Encode metadata as bytes (IPFS CID)
    const metadata = Buffer.from(params.metadataCID);

    const transaction = new TokenMintTransaction()
      .setTokenId(TokenId.fromString(params.tokenId))
      .addMetadata(metadata)
      .setMaxTransactionFee(new Hbar(20));

    // Sign with supply key
    const signedTx = await transaction.sign(params.supplyKey);
    const txResponse = await signedTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    const serialNumbers = receipt.serials;
    const serialNumber = serialNumbers[0].toNumber();

    console.log(`✅ NFT minted: ${params.tokenId} #${serialNumber}`);
    return serialNumber;
  } catch (error) {
    console.error('Failed to mint NFT:', error);
    throw error;
  }
}

/**
 * Associate token with account (required before receiving tokens)
 */
export async function associateToken(
  accountId: string,
  tokenId: string,
  accountKey: PrivateKey
): Promise<void> {
  const client = getHederaClient();

  try {
    const transaction = new TokenAssociateTransaction()
      .setAccountId(AccountId.fromString(accountId))
      .setTokenIds([TokenId.fromString(tokenId)])
      .freezeWith(client);

    const signedTx = await transaction.sign(accountKey);
    const txResponse = await signedTx.execute(client);
    await txResponse.getReceipt(client);

    console.log(`✅ Token ${tokenId} associated with account ${accountId}`);
  } catch (error) {
    console.error('Failed to associate token:', error);
    throw error;
  }
}

/**
 * Transfer fungible tokens ($LIFE)
 */
export async function transferTokens(
  tokenId: string,
  fromAccount: string,
  toAccount: string,
  amount: number,
  fromKey: PrivateKey
): Promise<void> {
  const client = getHederaClient();

  try {
    const transaction = new TransferTransaction()
      .addTokenTransfer(
        TokenId.fromString(tokenId),
        AccountId.fromString(fromAccount),
        -amount
      )
      .addTokenTransfer(
        TokenId.fromString(tokenId),
        AccountId.fromString(toAccount),
        amount
      )
      .freezeWith(client);

    const signedTx = await transaction.sign(fromKey);
    const txResponse = await signedTx.execute(client);
    await txResponse.getReceipt(client);

    console.log(`✅ Transferred ${amount} tokens from ${fromAccount} to ${toAccount}`);
  } catch (error) {
    console.error('Failed to transfer tokens:', error);
    throw error;
  }
}

/**
 * Transfer NFT
 */
export async function transferNFT(
  tokenId: string,
  serialNumber: number,
  fromAccount: string,
  toAccount: string,
  fromKey: PrivateKey
): Promise<void> {
  const client = getHederaClient();

  try {
    const transaction = new TransferTransaction()
      .addNftTransfer(
        TokenId.fromString(tokenId),
        serialNumber,
        AccountId.fromString(fromAccount),
        AccountId.fromString(toAccount)
      )
      .freezeWith(client);

    const signedTx = await transaction.sign(fromKey);
    const txResponse = await signedTx.execute(client);
    await txResponse.getReceipt(client);

    console.log(`✅ Transferred NFT ${tokenId} #${serialNumber} to ${toAccount}`);
  } catch (error) {
    console.error('Failed to transfer NFT:', error);
    throw error;
  }
}

/**
 * Query token balance
 */
export async function getTokenBalance(accountId: string, tokenId: string): Promise<number> {
  const client = getHederaClient();

  try {
    const balance = await new AccountBalanceQuery()
      .setAccountId(AccountId.fromString(accountId))
      .execute(client);

    const tokenBalance = balance.tokens?.get(TokenId.fromString(tokenId));
    return tokenBalance ? tokenBalance.toNumber() : 0;
  } catch (error) {
    console.error('Failed to query token balance:', error);
    throw error;
  }
}
