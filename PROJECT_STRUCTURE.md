# Bring2Life - Project Structure

Complete overview of the project architecture and file organization.

## Directory Tree

```
Bring2Life/
├── contracts/                      # Solidity smart contracts
│   └── Bring2LifeEscrow.sol       # Main escrow contract
│
├── scripts/                        # Deployment scripts
│   └── deploy.ts                  # Testnet/Mainnet deployment
│
├── src/                           # Next.js application source
│   ├── app/                       # App router pages
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Home page
│   │   ├── globals.css           # Global styles (Tailwind + custom)
│   │   ├── create-request/       # Commission creation
│   │   │   └── page.tsx
│   │   └── explore/              # Browse commissions
│   │       └── page.tsx
│   │
│   ├── components/               # Reusable React components
│   │   └── Navbar.tsx           # Navigation with wallet integration
│   │
│   ├── contexts/                # React Context providers
│   │   └── WalletContext.tsx   # Global wallet state
│   │
│   └── lib/                     # Utility libraries
│       └── hedera/              # Hedera SDK integrations
│           ├── client.ts        # Hedera client setup
│           ├── config.ts        # Network configuration
│           └── hts.service.ts   # Token service (HTS)
│
├── test/                        # Contract tests (optional)
│
├── .env.example                # Environment template
├── .env.local                  # Frontend environment (git-ignored)
├── .env                        # Contract deployment env (git-ignored)
├── .gitignore                  # Git ignore rules
├── hardhat.config.ts           # Hardhat configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS for Tailwind
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
│
├── README.md                   # Main documentation
├── DEPLOYMENT_GUIDE.md         # Detailed deployment steps
├── QUICKSTART.md               # Quick setup guide
└── PROJECT_STRUCTURE.md        # This file
```

---

## Core Files Explained

### Smart Contracts

**`contracts/Bring2LifeEscrow.sol`**
- Main escrow contract for milestone-based payments
- Handles commission creation, milestone submission/approval
- Integrates with Hedera Token Service (HTS)
- Implements platform fee (2.5%), pause/unpause, emergency withdraw
- Key functions: `createCommission`, `submitMilestone`, `approveMilestone`

### Deployment

**`scripts/deploy.ts`**
- Deploys escrow contract to Hedera testnet/mainnet
- Uses ethers.js + Hardhat
- Outputs contract address for frontend configuration
- Example: `pnpm run deploy:testnet`

### Frontend Pages

**`src/app/page.tsx`** - Home Page
- Hero section with value proposition
- Collapsible "How It Works" section
- Featured commission grid
- Footer with links
- "Powered by Hedera" branding

**`src/app/create-request/page.tsx`** - Commission Creation
- Multi-step form for new commissions
- Milestone definition with amounts
- Image upload placeholder (IPFS integration pending)
- Budget calculator
- Hedera security badge

**`src/app/explore/page.tsx`** - Browse Commissions
- Grid view of open commissions
- Category filters (portrait, digital, landscape, etc.)
- Sort options (recent, budget, deadline, bids)
- Mock data for MVP demo
- CTA to create new request

### Components

**`src/components/Navbar.tsx`**
- Fixed navigation bar with glassmorphism
- Wallet connection UI
- Account dropdown (profile, commissions, disconnect)
- "Powered by Hedera" badge
- Responsive design

### Contexts

**`src/contexts/WalletContext.tsx`**
- Global wallet state management
- Mock wallet connection for MVP
- Functions: `connectWallet`, `disconnectWallet`, `refreshBalance`
- Local storage for persisting connection
- Future: Integrate Web3Auth or Hedera Wallet Connect

### Hedera Integration

**`src/lib/hedera/client.ts`**
- Initializes Hedera SDK client for testnet
- Sets operator account and transaction limits
- Helper functions: `hbarToTinybars`, `tinybarsToHbar`, `isValidAccountId`

**`src/lib/hedera/config.ts`**
- Network configuration (testnet/mainnet)
- Contract addresses
- Platform settings (fees, minimums)
- HashScan explorer URL helpers

**`src/lib/hedera/hts.service.ts`**
- Hedera Token Service integration
- Functions for $LIFE token creation
- NFT collection creation with royalties
- Token minting, transfer, association
- Balance queries

### Configuration

**`hardhat.config.ts`**
- Hardhat configuration for Solidity compilation
- Network settings (testnet chainId 296, mainnet 295)
- Uses Hedera's JSON-RPC endpoints
- Optimizer enabled for gas efficiency

**`tailwind.config.ts`**
- Custom color palette (navy, gold, orange)
- Glassmorphism utilities
- Custom fonts (Inter, Satoshi fallback)
- Responsive breakpoints

**`next.config.js`**
- Image domains for IPFS
- Webpack config for Node.js polyfills
- React strict mode enabled

---

## Design System

### Colors

- **Primary Navy**: `#0D1117` - Background
- **Primary Gold**: `#FFD60A` - Accents, CTAs
- **Primary Orange**: `#FF4D00` - Gradient end
- **Glass Surface**: `rgba(255, 255, 255, 0.08)` - Card backgrounds
- **Glass Border**: `rgba(255, 255, 255, 0.15)` - Card borders

### Typography

- **Font Family**: Inter (primary), Satoshi (fallback)
- **Base Size**: 16px
- **Line Height**: 1.5
- **Headings**: Bold, 2xl-7xl sizes

### Components

- **Glass Card**: `.glass-card` - Glassmorphism effect with blur
- **Button Gradient**: `.btn-gradient` - Gradient accent CTA
- **Button Primary**: `.btn-primary` - Gold solid CTA
- **Button Secondary**: `.btn-secondary` - Outlined white CTA

### Accessibility

- Minimum 4.5:1 contrast ratio
- Reduced motion support (`prefers-reduced-motion`)
- High contrast mode support (`prefers-contrast: high`)
- Keyboard navigation
- ARIA labels on interactive elements

---

## Smart Contract Architecture

### Commission Lifecycle

1. **Created**: Client calls `createCommission()` with milestones and deposits HBAR
2. **In Progress**: Artist submits milestones via `submitMilestone()`
3. **Milestone Approval**: Client approves via `approveMilestone()`, payment released
4. **Completed**: All milestones approved, NFT minted, commission marked complete
5. **Cancelled/Disputed**: Optional flows for refunds or arbitration

### Payment Flow

```
Client deposits → Escrow Contract → Milestone approval → Artist payment (97.5%) + Platform fee (2.5%)
```

### Integration Points

- **HTS (Hedera Token Service)**: For $LIFE token and NFT minting (backend/SDK, not in contract)
- **HCS (Hedera Consensus Service)**: For audit logs (future feature)
- **Escrow Contract**: Holds HBAR in native currency, releases on approval

---

## State Management

### Global State

- **WalletContext**: Wallet connection, account ID, balance
- Future: Commission state, user profile, notifications

### Local State

- Form data in commission creation
- Filter/sort preferences in explore page
- UI toggles (modals, dropdowns)

---

## API Routes (Future)

Not implemented in MVP, but planned:

- `POST /api/commissions` - Create commission, upload to IPFS
- `GET /api/commissions` - Fetch commissions from database
- `POST /api/bids` - Submit bid on commission
- `POST /api/milestones/submit` - Artist submits work
- `POST /api/milestones/approve` - Client approves milestone
- `POST /api/ipfs/upload` - Upload images to IPFS

---

## Environment Variables

### Contract Deployment (`.env`)

```
HEDERA_TESTNET_OPERATOR_ID=0.0.xxxxx
HEDERA_TESTNET_OPERATOR_KEY=0x...
HEDERA_TESTNET_RPC_URL=https://testnet.hashio.io/api
```

### Frontend (`.env.local`)

```
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_HEDERA_OPERATOR_ID=0.0.xxxxx
NEXT_PUBLIC_HEDERA_OPERATOR_KEY=0x...
NEXT_PUBLIC_HEDERA_RPC_URL=https://testnet.hashio.io/api
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_LIFE_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=...
NEXT_PUBLIC_PINATA_API_KEY=...
```

---

## Development Workflow

### 1. Local Development

```bash
pnpm run dev  # Start Next.js dev server
```

### 2. Contract Changes

```bash
pnpm run compile         # Compile Solidity
pnpm run test:contracts  # Run tests
pnpm run deploy:testnet  # Deploy to testnet
```

### 3. Frontend Changes

- Edit files in `src/`
- Hot reload automatically applies changes
- Test in browser at `localhost:3000`

### 4. Production Build

```bash
pnpm run build   # Build Next.js
pnpm run start   # Start production server
```

---

## Testing Strategy

### Smart Contract Tests

- Located in `test/` directory (to be created)
- Use Hardhat + Chai for assertions
- Test cases: commission creation, milestone approval, refunds, edge cases

### Frontend Testing

- Manual testing for MVP
- Future: Jest + React Testing Library
- E2E testing: Playwright or Cypress

### Integration Testing

- Test full flow: create commission → submit milestone → approve → check on HashScan
- Verify balances update correctly
- Test with multiple accounts (client + artist)

---

## Deployment Targets

### Testnet (Current)

- Hedera Testnet (Chain ID 296)
- RPC: `https://testnet.hashio.io/api`
- Explorer: `https://hashscan.io/testnet`
- Free test HBAR from faucet

### Mainnet (Future)

- Hedera Mainnet (Chain ID 295)
- RPC: `https://mainnet.hashio.io/api`
- Explorer: `https://hashscan.io/mainnet`
- Real HBAR required

---

## Security Considerations

### Smart Contract

- Ownable pattern for admin functions
- Pausable for emergency stops
- ReentrancyGuard on payment functions
- Input validation on all external functions
- TODO: Professional security audit before mainnet

### Frontend

- Non-custodial wallet (no private keys stored)
- Environment variables for sensitive data
- HTTPS in production
- Input sanitization
- Rate limiting (backend)

---

## Performance Optimizations

- **Lazy Loading**: Images and components load on demand
- **Code Splitting**: Next.js automatic route-based splitting
- **Caching**: Service worker (future)
- **CDN**: Static assets on Vercel Edge Network
- **Hedera**: Sub-5 second finality, low fees

---

## Future Enhancements

### Phase 2: Token & NFT

- Deploy $LIFE token via HTS SDK
- Mint NFTs on commission completion
- Implement royalty system

### Phase 3: Governance

- DAO voting with $LIFE token
- Dispute arbitration
- Treasury management

### Phase 4: Scale

- Fiat on/off-ramps (MoonPay, Ramp)
- Mobile app (React Native)
- Multi-language support
- Advanced search/filtering

---

## Key Dependencies

### Frontend

- `next`: 14.2.15 - React framework
- `react`: 18.3.1 - UI library
- `tailwindcss`: 3.4.1 - Styling
- `@hashgraph/sdk`: 2.49.1 - Hedera SDK
- `ethers`: 6.13.2 - Ethereum library (for HSCS)

### Smart Contracts

- `hardhat`: 2.22.15 - Development environment
- `@openzeppelin/contracts`: 5.0.0+ - Secure contract templates
- `solidity`: 0.8.19 - Smart contract language

---

## Contributing Guidelines (Post-Hackathon)

1. Fork repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request with description
5. Pass CI/CD checks
6. Code review by maintainers

---

## License

MIT License - see LICENSE file

---

**For detailed setup instructions, see [QUICKSTART.md](./QUICKSTART.md)**

**For deployment, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

**Built for Hedera Hackathon 2025** | Powered by Hedera Hashgraph
