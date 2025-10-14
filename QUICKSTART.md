# Bring2Life - Quick Start Guide

Get up and running with Bring2Life in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- pnpm installed: `npm install -g pnpm`
- Hedera testnet account ([Get one here](https://portal.hedera.com/))

## Step 1: Get Test HBAR

1. Visit [Hedera Faucet](https://portal.hedera.com/faucet)
2. Enter your Account ID (format: `0.0.xxxxx`)
3. Request test HBAR (10,000 HBAR daily limit)

## Step 2: Clone and Install

```bash
cd Bring2Life
pnpm install
```

## Step 3: Configure Environment

Create `.env` file:

```env
HEDERA_TESTNET_OPERATOR_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_TESTNET_OPERATOR_KEY=your_ecdsa_private_key
HEDERA_TESTNET_RPC_URL=https://testnet.hashio.io/api
```

Create `.env.local` file:

```env
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_HEDERA_OPERATOR_ID=0.0.YOUR_ACCOUNT_ID
NEXT_PUBLIC_HEDERA_OPERATOR_KEY=your_private_key
NEXT_PUBLIC_HEDERA_RPC_URL=https://testnet.hashio.io/api
```

## Step 4: Deploy Smart Contract

```bash
pnpm run compile
pnpm run deploy:testnet
```

Copy the contract address from output and add to `.env.local`:

```env
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0xYourContractAddress
```

## Step 5: Start Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Test the App

1. Click "Connect Wallet" (mock connection for MVP)
2. Navigate to "Create Request"
3. Fill out commission form:
   - Title: Test Portrait
   - Description: Testing the platform
   - Budget: 10 HBAR total across milestones
   - Add 3 milestones (e.g., 3, 3, 4 HBAR)
4. Submit and check console for logs

## Key Pages

- **Home** (`/`) - Landing page with overview
- **Explore** (`/explore`) - Browse open commissions
- **Create Request** (`/create-request`) - Post new commission
- **Profile** (`/profile`) - User dashboard (coming soon)

## Important Files

- `contracts/Bring2LifeEscrow.sol` - Main escrow smart contract
- `src/lib/hedera/` - Hedera SDK integration
- `src/contexts/WalletContext.tsx` - Wallet state management
- `hardhat.config.ts` - Contract deployment config

## Testing Smart Contracts

```bash
pnpm run test:contracts
```

## View on HashScan

Check your transactions at:
- **Testnet**: https://hashscan.io/testnet/account/0.0.YOUR_ID
- **Contract**: https://hashscan.io/testnet/contract/YOUR_CONTRACT_ADDRESS

## Common Commands

```bash
pnpm run dev              # Start dev server
pnpm run build            # Build for production
pnpm run compile          # Compile contracts
pnpm run deploy:testnet   # Deploy to Hedera testnet
pnpm run test:contracts   # Run contract tests
```

## Troubleshooting

**Issue: "Port 3000 in use"**
- App will auto-switch to port 3001

**Issue: "Contract deployment failed"**
- Check HBAR balance on HashScan
- Verify `.env` credentials are correct
- Ensure using ECDSA key format

**Issue: "Transaction failed"**
- Ensure sufficient HBAR balance
- Check testnet.hashio.io is accessible
- Verify account ID format

## Next Steps

1. Explore the codebase in `src/`
2. Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed setup
3. Review smart contract in `contracts/`
4. Test milestone workflow
5. Customize UI components

## Resources

- [Full Documentation](./README.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Hedera Docs](https://docs.hedera.com/)
- [HashScan Explorer](https://hashscan.io/testnet)

## Need Help?

Check:
- [GitHub Issues](https://github.com/your-repo/issues)
- [Hedera Discord](https://hedera.com/discord)
- [Hedera Dev Docs](https://docs.hedera.com/)

---

**Built for Hedera Hackathon 2025** | Powered by Hedera Hashgraph
