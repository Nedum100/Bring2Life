# Bring2Life - Quick Reference Guide

**Use this as your go-to cheat sheet during implementation.**

---

## 📊 Current Status at a Glance

```
✅ DONE (30%):
- Next.js + TypeScript setup
- Smart contract (escrow)
- Basic UI (3 pages)
- Hedera SDK setup
- Documentation

❌ TODO (70%):
- Database (Supabase)
- Authentication (Web3Auth)
- IPFS upload (Pinata)
- 20+ missing pages
- Real wallet integration
- Payment flows
- Token deployment
- NFT minting
```

---

## 🎯 Implementation Order

```
Phase 0: Services Setup (1h)     → Get API keys
Phase 1: Backend (4h)             → Database + API
Phase 2: Auth (3h)                → Web3Auth + profiles
Phase 3: Commissions (5h)         → IPFS + bidding
Phase 4: Milestones (5h)          → Smart contract integration
Phase 5: Tokens (3h)              → $LIFE + NFT
Phase 6: Governance (4h)          → DAO + polish
```

---

## 📝 Free Services We're Using

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Supabase** | Database + Auth + Storage | 500MB, 50k users |
| **Pinata** | IPFS file storage | 1GB, 100GB bandwidth |
| **Web3Auth** | Wallet login | 1k wallets/month |
| **Vercel** | Frontend hosting | Unlimited personal |
| **Hedera Testnet** | Blockchain | 10k HBAR daily from faucet |

---

## 🔗 Important URLs

**Services:**
- Supabase: https://supabase.com/
- Pinata: https://pinata.cloud/
- Web3Auth: https://dashboard.web3auth.io/
- Vercel: https://vercel.com/
- Hedera Portal: https://portal.hedera.com/
- Hedera Faucet: https://portal.hedera.com/faucet

**Blockchain:**
- HashScan Testnet: https://hashscan.io/testnet
- Hedera Docs: https://docs.hedera.com/
- Hedera SDK: https://docs.hedera.com/hedera/sdks-and-apis/sdks

---

## 📂 Project Structure Quick Map

```
Bring2Life/
├── contracts/
│   └── Bring2LifeEscrow.sol          # Smart contract
├── src/
│   ├── app/                          # Pages
│   │   ├── page.tsx                  # Home ✅
│   │   ├── create-request/           # Create ✅
│   │   └── explore/                  # Browse ✅
│   ├── components/                   # Reusable UI
│   │   └── Navbar.tsx                # Nav ✅
│   ├── contexts/
│   │   └── WalletContext.tsx         # Wallet state ✅
│   └── lib/
│       └── hedera/                   # Blockchain
│           ├── client.ts             # Client ✅
│           ├── config.ts             # Config ✅
│           └── hts.service.ts        # Tokens ✅
├── scripts/
│   └── deploy.ts                     # Deploy script ✅
└── docs/                             # All .md files
```

---

## 🚀 Commands Cheat Sheet

```bash
# Development
pnpm run dev              # Start dev server (already running on :3001)
pnpm run build            # Build for production
pnpm run start            # Start production server

# Smart Contracts
pnpm run compile          # Compile Solidity
pnpm run deploy:testnet   # Deploy to Hedera testnet
pnpm run test:contracts   # Run contract tests

# Database (after Phase 1)
pnpm run db:migrate       # Run Supabase migrations
pnpm run db:seed          # Seed test data
pnpm run db:types         # Generate TypeScript types

# Deployment
vercel                    # Deploy to Vercel
vercel --prod             # Deploy to production
```

---

## 🔑 Environment Variables Needed

### Frontend (`.env.local`)

```env
# Hedera
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_HEDERA_OPERATOR_ID=0.0.xxxxx
NEXT_PUBLIC_HEDERA_OPERATOR_KEY=0x...
NEXT_PUBLIC_HEDERA_RPC_URL=https://testnet.hashio.io/api
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...

# Supabase (Phase 1)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Pinata (Phase 1)
NEXT_PUBLIC_PINATA_API_KEY=...
PINATA_API_SECRET=...
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud

# Web3Auth (Phase 2)
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=...
NEXT_PUBLIC_WEB3AUTH_NETWORK=testnet
```

### Smart Contracts (`.env`)

```env
HEDERA_TESTNET_OPERATOR_ID=0.0.xxxxx
HEDERA_TESTNET_OPERATOR_KEY=0x...
HEDERA_TESTNET_RPC_URL=https://testnet.hashio.io/api
```

---

## 📋 Phase Prompts (Copy-Paste Ready)

### Phase 0: Setup

```
I've completed the service setup. Here are my credentials:

SUPABASE:
- Project URL: [paste]
- Anon Key: [paste]
- Service Role: [paste]

PINATA:
- API Key: [paste]
- API Secret: [paste]

WEB3AUTH:
- Client ID: [paste]

Please update .env.local and verify configuration.
```

### Phase 1: Backend

```
Phase 1: Backend Infrastructure

Set up complete Supabase database schema per SRS:
1. Create all tables (users, bounties, participations, milestones, etc.)
2. Set up RLS policies
3. Create database functions
4. Build Next.js API routes for user, bounty, bid, milestone management
5. Generate TypeScript types
6. Create database testing script

Use Supabase SQL Editor for migrations.
```

### Phase 2: Authentication

```
Phase 2: Authentication & User Management

Implement real wallet authentication:
1. Replace mock WalletContext with Web3Auth integration
2. Create /auth/login with social login options
3. Create /auth/onboarding for role selection
4. Create /profile and /profile/edit pages
5. Implement protected routes middleware
6. Update Navbar with real user data

Test full auth flow from login to profile creation.
```

### Phase 3: Commissions

```
Phase 3: Commission & Bidding System

Build complete commission lifecycle:
1. Enhance /create-request with real IPFS upload via Pinata
2. Create /commission/[id] detail page with bidding
3. Create /commission/[id]/bid submission page
4. Create /artist/dashboard for browsing jobs
5. Create /my-commissions for tracking

Integrate with smart contract for escrow creation.
```

### Phase 4: Milestones

```
Phase 4: Milestone Workflow & Smart Contract Integration

Build milestone workflow with Hedera integration:
1. Create /commission/[id]/milestones management page
2. Create artist submission flow with IPFS upload
3. Create client approval flow with contract calls
4. Build escrow.service.ts wrapper
5. Implement payment tracking

Test: create → submit → approve → verify on HashScan
```

### Phase 5: Tokens

```
Phase 5: Token System & NFT Minting

Deploy $LIFE token and NFT certificates:
1. Deploy $LIFE token to Hedera testnet
2. Create NFT collection with royalties
3. Implement auto-mint workflow on completion
4. Create /tokens dashboard
5. Integrate token earning logic

Test: complete commission → verify NFT minted
```

### Phase 6: Governance

```
Phase 6: Governance, Reputation & Polish

Final features and polish:
1. Build reputation system with HCS logging
2. Implement basic DAO governance pages
3. Build dispute resolution flow
4. Create admin dashboard
5. Add leaderboard, how-it-works, FAQ pages
6. Final polish (loading, errors, responsive)

Test complete flow from registration to DAO voting.
```

---

## 🐛 Common Issues & Solutions

### Issue: Port 3000 in use
**Solution**: App auto-switches to 3001 ✅

### Issue: Contract deployment fails
**Solution**: Check HBAR balance, verify ECDSA key format

### Issue: "Module not found" errors
**Solution**: `pnpm install` and restart dev server

### Issue: Supabase connection fails
**Solution**: Check URL and anon key in .env.local

### Issue: IPFS upload fails
**Solution**: Verify Pinata API keys, check file size < 100MB

### Issue: Transaction fails
**Solution**: Ensure sufficient HBAR, check testnet.hashio.io status

---

## 📞 Where to Get Help

**Documentation:**
- IMPLEMENTATION_ROADMAP.md - Full guide
- GAP_ANALYSIS.md - What's missing
- DEPLOYMENT_GUIDE.md - Deployment help
- HACKATHON_CHECKLIST.md - Submission prep

**External:**
- Hedera Discord: https://hedera.com/discord
- Supabase Docs: https://supabase.com/docs
- Web3Auth Docs: https://web3auth.io/docs

---

## ✅ Pre-Flight Checklist

Before starting each phase:

- [ ] Dev server running (`pnpm run dev`)
- [ ] .env.local has all required variables
- [ ] Previous phase tested and working
- [ ] Git commit of previous phase
- [ ] Read phase prompt carefully

---

## 🎯 Success Criteria

**Minimum Viable Demo (Phases 1-4):**
- ✅ User can register with Web3Auth
- ✅ User can create commission with IPFS upload
- ✅ Artist can bid on commission
- ✅ Client can accept bid and start commission
- ✅ Artist can submit milestone with proof
- ✅ Client can approve and release payment
- ✅ Transaction visible on HashScan

**Bonus (Phases 5-6):**
- ✅ NFT minted on completion
- ✅ DAO governance functional
- ✅ Reputation system working

---

## 📈 Progress Tracking

Use this to track your progress:

```
[ ] Phase 0: Services setup (credentials obtained)
[ ] Phase 1: Backend (database + API working)
[ ] Phase 2: Auth (can login and view profile)
[ ] Phase 3: Commissions (can create and bid)
[ ] Phase 4: Milestones (full flow works)
[ ] Phase 5: Tokens (NFT minted)
[ ] Phase 6: Governance (DAO functional)
[ ] Testing: All flows verified
[ ] Deployment: Live on Vercel
[ ] Submission: Hackathon form filled
```

---

## 🚀 Ready to Start?

1. **Read**: IMPLEMENTATION_ROADMAP.md (full plan)
2. **Setup**: Complete Phase 0 (get credentials)
3. **Execute**: Copy Phase 1 prompt and let's go!

**Your dev server is ready at http://localhost:3001** ✨

**Let's build something amazing!** 🔥
