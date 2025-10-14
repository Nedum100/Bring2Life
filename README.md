# Bring2Life - Web3 Art Commission Platform

> Commission custom art with blockchain trust. **Powered by Hedera.**

Bring2Life is a decentralized application (dApp) that connects clients with artists for commissioning physical and digital art, leveraging Hedera Hashgraph for trust, transparency, and secure payments.

## Features

- **Milestone-Based Escrow**: Smart contracts hold funds and release payments as milestones complete
- **NFT Certificates**: Each completed commission receives an authentic NFT certificate with royalties
- **On-Chain Reputation**: Immutable logs for audit trails and reputation building
- **Low-Cost Transactions**: Built on Hedera Testnet for fast, eco-friendly transactions
- **Web2.5 Experience**: Simple wallet integration with minimal Web3 friction

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Blockchain**: Hedera Hashgraph (Testnet → Mainnet)
  - Smart Contracts: Solidity 0.8.19 via HSCS (Hedera Smart Contract Service)
  - Token Service: HTS (Hedera Token Service) for $LIFE and NFTs
  - Consensus Service: HCS (Hedera Consensus Service) for audit logs
- **Smart Contract Tooling**: Hardhat
- **Design System**: Glassmorphism UI with accessibility features

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Hedera Testnet account ([Get one here](https://portal.hedera.com/))
- Test HBAR from [faucet](https://portal.hedera.com/faucet)

### Installation

1. **Clone and install dependencies**:
```bash
cd Bring2Life
pnpm install
```

2. **Configure environment variables**:
```bash
# Create .env.local for frontend
cp .env.example .env.local

# Create .env for smart contracts
cp .env.example .env
```

Edit `.env` with your Hedera credentials:
```env
HEDERA_TESTNET_OPERATOR_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_TESTNET_OPERATOR_KEY=your_ecdsa_private_key
HEDERA_TESTNET_RPC_URL=https://testnet.hashio.io/api
```

3. **Deploy smart contracts**:
```bash
pnpm run compile
pnpm run deploy:testnet
```

Copy the deployed contract address to `.env.local`:
```env
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0xYourContractAddress
```

4. **Start development server**:
```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Bring2Life/
├── contracts/              # Solidity smart contracts
│   └── Bring2LifeEscrow.sol
├── scripts/                # Deployment scripts
│   └── deploy.ts
├── src/
│   ├── app/               # Next.js app router pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts (WalletContext)
│   └── lib/
│       └── hedera/        # Hedera SDK integrations
│           ├── client.ts  # Hedera client setup
│           ├── config.ts  # Network configuration
│           └── hts.service.ts  # Token service
├── hardhat.config.ts      # Hardhat configuration
└── tailwind.config.ts     # Tailwind CSS configuration
```

## Smart Contract

The `Bring2LifeEscrow` contract manages:
- Commission creation with milestone definitions
- Escrow deposits in HBAR
- Milestone submission and approval workflow
- Payment releases with 2.5% platform fee
- Dispute handling
- Integration with HTS for NFT minting

### Key Functions

- `createCommission()` - Create new commission with milestones
- `submitMilestone()` - Artist submits completed work
- `approveMilestone()` - Client approves and releases payment
- `raiseDispute()` - Raise dispute for DAO arbitration
- `cancelCommission()` - Cancel before work starts

## Hedera Integration

### Hedera Token Service (HTS)
- **$LIFE Token**: Fungible token for governance and staking
- **NFT Certificates**: Non-fungible tokens with royalties and IPFS metadata

### Hedera Smart Contract Service (HSCS)
- EVM-compatible Solidity contracts
- Milestone-based escrow logic
- Platform fee distribution

### Hedera Consensus Service (HCS)
- Immutable audit logs
- Reputation scoring events
- Timestamped commission milestones

## Development Commands

```bash
# Frontend
pnpm run dev              # Start dev server
pnpm run build            # Build for production
pnpm run start            # Start production server

# Smart Contracts
pnpm run compile          # Compile Solidity contracts
pnpm run test:contracts   # Run contract tests
pnpm run deploy:testnet   # Deploy to Hedera Testnet
pnpm run clean            # Clean artifacts
```

## Roadmap

### Phase 1: MVP (Current)
- [x] Basic Next.js setup
- [x] Hedera SDK integration
- [x] Escrow smart contract
- [x] Wallet connection UI
- [ ] Commission creation flow
- [ ] Artist bidding system
- [ ] Milestone workflow

### Phase 2: Token & NFT
- [ ] Deploy $LIFE token on HTS
- [ ] NFT minting integration
- [ ] Royalty system
- [ ] Staking mechanism

### Phase 3: Governance
- [ ] DAO voting system
- [ ] Dispute arbitration
- [ ] Treasury management

### Phase 4: Scale
- [ ] Move to Hedera Mainnet
- [ ] Fiat on/off-ramps
- [ ] Mobile app
- [ ] Additional art categories

## Contributing

This is a hackathon MVP project. Contributions welcome after initial release!

## Security

⚠️ **Testnet Only**: This project is currently deployed on Hedera Testnet. Do not use with real funds until mainnet deployment and security audit.

## License

MIT License - see LICENSE file for details

## Resources

- [Hedera Documentation](https://docs.hedera.com/)
- [Hedera Token Service](https://docs.hedera.com/hedera/sdks-and-apis/sdks/token-service)
- [Hedera Smart Contracts](https://docs.hedera.com/hedera/core-concepts/smart-contracts)
- [HashScan Testnet Explorer](https://hashscan.io/testnet)

---

**Built for Hedera Hackathon 2025** | Powered by Hedera Hashgraph
