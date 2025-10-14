# Bring2Life - Complete Deployment Guide

This guide walks you through deploying **Bring2Life** on Hedera Testnet for the hackathon demo, with plans to transition to Mainnet.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Hedera Account Setup](#hedera-account-setup)
3. [Environment Configuration](#environment-configuration)
4. [Smart Contract Deployment](#smart-contract-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Testing the Application](#testing-the-application)
7. [Mainnet Migration](#mainnet-migration)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** package manager: `npm install -g pnpm`
- **Git** for version control
- **Hedera Account** ([Create one](https://portal.hedera.com/))

### Knowledge Requirements

- Basic blockchain concepts
- Familiarity with Next.js and React
- Understanding of smart contracts (Solidity)

---

## Hedera Account Setup

### Step 1: Create Hedera Testnet Account

1. Visit [Hedera Portal](https://portal.hedera.com/)
2. Sign up for a free account
3. Navigate to **Testnet** section
4. Create a new testnet account
5. **Save your Account ID** (format: `0.0.xxxxx`)
6. **Save your Private Key** (ECDSA format recommended)

### Step 2: Fund Your Account with Test HBAR

1. Visit [Hedera Faucet](https://portal.hedera.com/faucet)
2. Enter your Account ID
3. Request test HBAR (you'll receive 10,000 HBAR daily)
4. Verify balance on [HashScan Testnet Explorer](https://hashscan.io/testnet)

> **Important**: Use ECDSA private keys, not ED25519. See [Hedera Key Types Guide](https://docs.hedera.com/hedera/core-concepts/keys-and-signatures).

---

## Environment Configuration

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd Bring2Life
pnpm install
```

### Step 2: Configure Smart Contract Environment

Create `.env` file in the project root:

```env
# Hedera Testnet Configuration
HEDERA_TESTNET_OPERATOR_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_TESTNET_OPERATOR_KEY=your_ecdsa_private_key_here
HEDERA_TESTNET_RPC_URL=https://testnet.hashio.io/api

# For future mainnet deployment
# HEDERA_MAINNET_OPERATOR_ID=
# HEDERA_MAINNET_OPERATOR_KEY=
# HEDERA_MAINNET_RPC_URL=https://mainnet.hashio.io/api
```

**Example**:
```env
HEDERA_TESTNET_OPERATOR_ID=0.0.123456
HEDERA_TESTNET_OPERATOR_KEY=0x302e020100300506032b657004220420a1b2c3d4e5f6...
HEDERA_TESTNET_RPC_URL=https://testnet.hashio.io/api
```

### Step 3: Configure Frontend Environment

Create `.env.local` file:

```env
# Hedera Network Configuration
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_HEDERA_OPERATOR_ID=0.0.YOUR_ACCOUNT_ID
NEXT_PUBLIC_HEDERA_OPERATOR_KEY=your_private_key
NEXT_PUBLIC_HEDERA_RPC_URL=https://testnet.hashio.io/api

# Contract Addresses (will be filled after deployment)
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=
NEXT_PUBLIC_LIFE_TOKEN_ADDRESS=

# Optional: Web3Auth for production wallet integration
# NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=

# Optional: IPFS/Pinata for image uploads
# NEXT_PUBLIC_PINATA_API_KEY=
# NEXT_PUBLIC_PINATA_SECRET_KEY=
# NEXT_PUBLIC_PINATA_JWT=
```

---

## Smart Contract Deployment

### Step 1: Compile Contracts

```bash
pnpm run compile
```

Expected output:
```
Compiled 15 Solidity files successfully
✓ Bring2LifeEscrow.sol compiled
```

### Step 2: Run Tests (Optional but Recommended)

```bash
pnpm run test:contracts
```

Verify all tests pass before deployment.

### Step 3: Deploy to Hedera Testnet

```bash
pnpm run deploy:testnet
```

**Expected Output**:
```
🚀 Deploying Bring2Life Escrow Contract to Hedera Testnet...

Deploying with account: 0x...
Account balance: 9500.00 HBAR

Deploying Bring2LifeEscrow contract...

✅ Contract deployed successfully!
Contract Address: 0x1234567890abcdef1234567890abcdef12345678
Platform Treasury: 0x...

📋 Next Steps:
1. Add this address to your .env.local file:
   NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678

2. Verify contract on HashScan:
   https://hashscan.io/testnet/contract/0x1234567890abcdef1234567890abcdef12345678
```

### Step 4: Update Environment Variables

Copy the deployed contract address and update `.env.local`:

```env
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

### Step 5: Verify Contract on HashScan

1. Visit the HashScan URL from deployment output
2. Verify contract is deployed and transactions are visible
3. Check contract balance and configuration

---

## Frontend Deployment

### Option 1: Local Development

```bash
pnpm run dev
```

Access at [http://localhost:3000](http://localhost:3000)

### Option 2: Production Build

```bash
pnpm run build
pnpm run start
```

### Option 3: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Deploy again to apply changes

4. **Custom Domain** (Optional):
   - Add custom domain in Vercel Dashboard
   - Update DNS records

---

## Testing the Application

### Test Checklist

1. **Wallet Connection**
   - [ ] Connect wallet button works
   - [ ] Account ID displays correctly
   - [ ] Balance shows test HBAR

2. **Commission Creation**
   - [ ] Navigate to "Create Request"
   - [ ] Fill out form with test data
   - [ ] Add milestone amounts (total < your balance)
   - [ ] Submit and verify transaction on HashScan

3. **Explore Page**
   - [ ] View mock commissions
   - [ ] Filter by category
   - [ ] Click to view details

4. **Smart Contract Interaction**
   - [ ] Test escrow deposit
   - [ ] Test milestone submission (backend required)
   - [ ] Test milestone approval

### Test Scenarios

**Scenario 1: Create Simple Commission**
```
Title: Test Portrait
Budget: 10 HBAR (3 + 3 + 4 milestones)
Deadline: 30 days from now
```

**Scenario 2: Browse and Bid** (requires artist account)
```
1. Create second Hedera account for artist
2. Browse commissions as artist
3. Submit bid (frontend flow)
```

---

## Mainnet Migration

### When Ready for Production

1. **Audit Smart Contracts**
   - Get professional security audit
   - Fix any vulnerabilities
   - Test extensively on testnet

2. **Create Mainnet Accounts**
   ```bash
   # Fund mainnet accounts with real HBAR
   # Update .env with mainnet credentials
   ```

3. **Update Configuration**
   ```env
   NEXT_PUBLIC_HEDERA_NETWORK=mainnet
   HEDERA_MAINNET_OPERATOR_ID=0.0.YOUR_MAINNET_ID
   HEDERA_MAINNET_OPERATOR_KEY=your_mainnet_key
   HEDERA_MAINNET_RPC_URL=https://mainnet.hashio.io/api
   ```

4. **Deploy to Mainnet**
   ```bash
   pnpm run deploy:mainnet
   ```

5. **Verify Mainnet Contract**
   - Test with small amounts first
   - Monitor transactions on HashScan Mainnet

---

## Troubleshooting

### Common Issues

#### Issue: "Insufficient HBAR balance"

**Solution**: Request more test HBAR from faucet or reduce commission amounts.

#### Issue: "Invalid private key format"

**Solution**: Ensure using ECDSA format (starts with `0x`), not ED25519.

#### Issue: "Contract deployment failed"

**Possible causes**:
- Insufficient gas/HBAR
- Network connectivity issues
- Invalid operator credentials

**Solution**:
```bash
# Check account balance
curl https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.YOUR_ID

# Verify RPC endpoint
curl https://testnet.hashio.io/api
```

#### Issue: "Transaction timeout"

**Solution**: Increase timeout in Hardhat config or retry deployment.

#### Issue: "Frontend can't connect to contract"

**Checklist**:
- [ ] Contract address in `.env.local` is correct
- [ ] Environment variables loaded (restart dev server)
- [ ] Wallet connected to correct network (testnet)

### Debug Commands

```bash
# Check contract status
pnpm hardhat verify --network testnet <CONTRACT_ADDRESS>

# View Hedera account info
curl https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.YOUR_ID

# Check contract on HashScan
# Visit: https://hashscan.io/testnet/contract/<CONTRACT_ADDRESS>
```

---

## Next Steps

1. **Integrate Backend** (optional for hackathon)
   - Set up database for storing commission data
   - Implement IPFS upload service
   - Add webhook for contract events

2. **Add Token Features**
   - Deploy $LIFE token via HTS
   - Implement NFT minting on completion
   - Add staking mechanism

3. **Enhance Security**
   - Add rate limiting
   - Implement proper authentication
   - Conduct security audit

4. **Scale**
   - Add more art categories
   - Implement DAO governance
   - Integrate fiat on/off-ramps

---

## Resources

- [Hedera Documentation](https://docs.hedera.com/)
- [HashScan Explorer](https://hashscan.io/testnet)
- [Hedera SDK (JavaScript)](https://docs.hedera.com/hedera/sdks-and-apis/sdks)
- [Hardhat for Hedera](https://docs.hedera.com/hedera/tutorials/smart-contracts/deploy-your-first-smart-contract/using-hardhat)
- [Bring2Life GitHub Issues](your-repo-url/issues)

---

## Support

For hackathon-specific questions:
- Check [GitHub Issues](your-repo-url/issues)
- Review [Hedera Discord](https://hedera.com/discord)
- Consult [Hedera Developer Docs](https://docs.hedera.com/)

---

**Built with ❤️ for Hedera Hackathon 2025**

*Powered by Hedera Hashgraph*
