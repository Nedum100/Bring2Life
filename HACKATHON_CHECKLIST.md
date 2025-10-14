# Bring2Life - Hackathon Submission Checklist

Use this checklist to prepare your Hedera Hackathon submission.

---

## Pre-Submission Setup

### ✅ Environment Configuration

- [ ] Create Hedera testnet account at [portal.hedera.com](https://portal.hedera.com/)
- [ ] Get test HBAR from [faucet](https://portal.hedera.com/faucet) (10,000 HBAR)
- [ ] Copy `.env.example` to `.env` and `.env.local`
- [ ] Fill in Hedera credentials (Account ID and Private Key)
- [ ] Verify credentials are ECDSA format (not ED25519)

### ✅ Contract Deployment

- [ ] Install dependencies: `pnpm install`
- [ ] Compile contracts: `pnpm run compile`
- [ ] Deploy to testnet: `pnpm run deploy:testnet`
- [ ] Copy contract address to `.env.local` as `NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS`
- [ ] Verify contract on [HashScan](https://hashscan.io/testnet)
- [ ] Test contract with small transaction

### ✅ Frontend Setup

- [ ] Ensure `.env.local` has all required variables
- [ ] Start dev server: `pnpm run dev`
- [ ] Access app at [http://localhost:3001](http://localhost:3001)
- [ ] Verify "Powered by Hedera" branding visible
- [ ] Test wallet connection (mock)
- [ ] Test commission creation page
- [ ] Test explore page with filters

---

## Demo Preparation

### ✅ Test Flows

**Flow 1: Browse Commissions**
- [ ] Navigate to Explore page
- [ ] Apply category filters
- [ ] Sort by different criteria
- [ ] View commission cards

**Flow 2: Create Commission**
- [ ] Click "Create Request"
- [ ] Fill out commission form
- [ ] Add 3 milestones with amounts
- [ ] Calculate total budget
- [ ] Submit form (verify console logs)

**Flow 3: Wallet Integration**
- [ ] Click "Connect Wallet"
- [ ] Verify mock connection shows account ID
- [ ] Check balance display
- [ ] Open account dropdown
- [ ] Test disconnect

### ✅ Visual Verification

- [ ] Glassmorphism effects working
- [ ] "Powered by Hedera" badge in navbar
- [ ] "Powered by Hedera" badge in hero section
- [ ] Gradient buttons rendering correctly
- [ ] Mobile responsive (test at 375px, 768px, 1024px)
- [ ] Dark mode with proper contrast
- [ ] No console errors

---

## Documentation Review

### ✅ Files to Review

- [ ] **README.md** - Main project overview
- [ ] **QUICKSTART.md** - 5-minute setup guide
- [ ] **DEPLOYMENT_GUIDE.md** - Detailed deployment steps
- [ ] **PROJECT_STRUCTURE.md** - Architecture overview
- [ ] **IMPLEMENTATION_SUMMARY.md** - What was built
- [ ] **HACKATHON_CHECKLIST.md** - This file

### ✅ Code Quality

- [ ] TypeScript compilation successful: `pnpm run build`
- [ ] No critical linter errors
- [ ] Smart contract compiles without warnings
- [ ] Environment variables documented in `.env.example`

---

## Hedera Integration Verification

### ✅ Smart Contract (HSCS)

- [ ] Contract deployed to Hedera Testnet
- [ ] Visible on HashScan with verified source (optional)
- [ ] Uses HSCS (Hedera Smart Contract Service)
- [ ] Implements milestone-based escrow
- [ ] Platform fee (2.5%) configured
- [ ] Emergency functions (pause/unpause)

### ✅ Token Service (HTS) - Ready

- [ ] `hts.service.ts` implements token functions
- [ ] $LIFE token creation function ready
- [ ] NFT minting with royalties ready
- [ ] Token transfer/association functions ready
- [ ] (Deployment script available for Phase 2)

### ✅ Consensus Service (HCS) - Planned

- [ ] Architecture documented for audit logs
- [ ] Integration points identified
- [ ] Planned for Phase 2 implementation

### ✅ Network Configuration

- [ ] Testnet RPC: `https://testnet.hashio.io/api`
- [ ] Chain ID: 296 (Testnet)
- [ ] Mirror Node URL configured
- [ ] HashScan links for transactions
- [ ] Mainnet config ready (commented out)

---

## Submission Assets

### ✅ GitHub Repository

- [ ] Repository is public
- [ ] README.md is comprehensive
- [ ] .env files are git-ignored (only `.env.example` committed)
- [ ] All source code committed
- [ ] Documentation files included
- [ ] License file added (MIT)

### ✅ Demo Video (if required)

- [ ] Record screen showing app in action
- [ ] Narrate key features:
  - Hedera integration
  - Milestone-based escrow
  - "Powered by Hedera" branding
  - Commission creation flow
- [ ] Show HashScan transaction verification
- [ ] Length: 2-5 minutes
- [ ] Upload to YouTube/Vimeo

### ✅ Screenshots

- [ ] Home page hero with "Powered by Hedera"
- [ ] Create request page with milestones
- [ ] Explore page with filters
- [ ] Wallet connection UI
- [ ] Smart contract on HashScan
- [ ] (Optional: Architecture diagram)

### ✅ Presentation Deck (if required)

- [ ] Problem statement (art commission challenges)
- [ ] Solution (Bring2Life with Hedera)
- [ ] Technical architecture
- [ ] Hedera integration highlights
- [ ] Demo screenshots
- [ ] Future roadmap
- [ ] Team and contact info

---

## Hackathon Submission Form

### ✅ Required Information

- [ ] **Project Name**: Bring2Life
- [ ] **Tagline**: "Commission custom art with blockchain trust"
- [ ] **Category**: Marketplace / DeFi / NFT (choose appropriate)
- [ ] **Description**:
  > Bring2Life is a decentralized art commission marketplace powered by Hedera Hashgraph. It connects clients with artists through milestone-based smart contract escrow, ensuring trust, transparency, and secure payments. Features include HSCS escrow contracts, HTS token integration for NFTs and governance, and an intuitive Web2.5 user experience.

- [ ] **Hedera Services Used**:
  - ✅ HSCS (Hedera Smart Contract Service) - Escrow contract
  - ✅ HTS (Hedera Token Service) - $LIFE token & NFTs (ready)
  - ⏳ HCS (Hedera Consensus Service) - Audit logs (planned)

- [ ] **GitHub URL**: [your-repo-url]
- [ ] **Demo URL**: [vercel-deployment-url] (optional)
- [ ] **Video URL**: [youtube-url] (if required)
- [ ] **HashScan Contract Link**: `https://hashscan.io/testnet/contract/[YOUR_CONTRACT_ADDRESS]`

- [ ] **Tech Stack**:
  - Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS
  - Smart Contracts: Solidity 0.8.19, Hardhat
  - Blockchain: Hedera Hashgraph (Testnet)
  - SDK: @hashgraph/sdk 2.49.1

- [ ] **Team Members**: [Your Name/Team Name]
- [ ] **Contact Email**: [your-email]

---

## Testing Before Submission

### ✅ Final Checks

- [ ] Clean install test: `rm -rf node_modules && pnpm install`
- [ ] Build test: `pnpm run build`
- [ ] Production test: `pnpm run start`
- [ ] Contract deployment test (on fresh account)
- [ ] All documentation links work
- [ ] No hardcoded sensitive data in code
- [ ] `.env.example` has all required variables

### ✅ Cross-Browser Testing

- [ ] Chrome/Edge (primary)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browser (Chrome/Safari)

### ✅ Performance

- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Images optimized
- [ ] Fast page loads (< 2s)

---

## Post-Submission

### ✅ Monitoring

- [ ] Check HashScan for contract activity
- [ ] Monitor GitHub for issues/questions
- [ ] Respond to hackathon organizer requests
- [ ] Join Hedera Discord for updates

### ✅ Improvements (if time allows)

- [ ] Add contract tests: `pnpm run test:contracts`
- [ ] Deploy $LIFE token to testnet
- [ ] Mint sample NFTs
- [ ] Add backend API (optional)
- [ ] Deploy to Vercel for live demo

---

## Judging Criteria Alignment

### ✅ Innovation
- [ ] Solves real-world problem (art commission disputes)
- [ ] Novel use of milestone-based escrow
- [ ] NFT certificates for authenticity
- [ ] Web2.5 UX for accessibility

### ✅ Technical Implementation
- [ ] Clean, modular code
- [ ] Proper TypeScript types
- [ ] Smart contract best practices (OpenZeppelin)
- [ ] Comprehensive documentation

### ✅ Hedera Integration
- [ ] Uses HSCS for escrow logic
- [ ] HTS integration ready for tokens/NFTs
- [ ] Testnet deployed and verified
- [ ] Plans for HCS audit logs
- [ ] "Powered by Hedera" branding prominent

### ✅ User Experience
- [ ] Intuitive navigation
- [ ] Glassmorphism design
- [ ] Mobile responsive
- [ ] Accessibility features (contrast, reduced motion)

### ✅ Completeness
- [ ] MVP functional and demoable
- [ ] Documentation comprehensive
- [ ] Deployment guide included
- [ ] Future roadmap outlined

---

## Demo Day Preparation

### ✅ Elevator Pitch (30 seconds)

> "Bring2Life is a decentralized marketplace for custom art commissions. Using Hedera's fast and low-cost blockchain, we provide milestone-based smart contract escrow, ensuring artists get paid fairly and clients get the art they want. Every completed commission receives an NFT certificate with built-in royalties. We're making art commissions trustworthy and transparent."

### ✅ Key Talking Points

1. **Problem**: Art commission disputes, payment issues, IP concerns
2. **Solution**: Hedera-powered escrow + NFT certificates
3. **Hedera Advantages**: 3-5s finality, $0.0001/tx, carbon-negative
4. **Milestone System**: Pay as work progresses, funds locked in escrow
5. **Roadmap**: Token launch → DAO governance → Mainnet

### ✅ Demo Script

1. Show home page with "Powered by Hedera"
2. Navigate to Explore, filter commissions
3. Click Create Request, walk through form
4. Show milestone builder (3 milestones, 10 HBAR total)
5. Explain escrow contract on HashScan
6. Highlight transaction speed and cost
7. Preview future: NFT minting, DAO governance

---

## Emergency Contacts

- **Hedera Support**: [Hedera Discord](https://hedera.com/discord)
- **Hackathon Organizers**: [Check hackathon portal]
- **Technical Issues**: Review DEPLOYMENT_GUIDE.md troubleshooting section

---

## Celebration! 🎉

Once submitted:
- [ ] Take a screenshot of submission confirmation
- [ ] Share on social media with #HederaHackathon
- [ ] Thank the Hedera team
- [ ] Rest and wait for results!

---

**Good luck with your submission!**

Built with ❤️ on Hedera Hashgraph

For questions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) troubleshooting.
