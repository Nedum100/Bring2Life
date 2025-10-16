# Next Steps: Run Database Migrations

## Current Status

Phase 1 backend infrastructure code is complete, but the database migrations need to be applied to your Supabase instance.

**Test Results**: Database test failed (7.1% success) because tables and functions don't exist yet.

## Step 1: Run Migrations in Supabase Dashboard

### Quick Method (Recommended)

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard/project/rkbfjfuxtugyidfxcmkz
   - Navigate to **SQL Editor** in the left sidebar

2. **Run Migration 1: Initial Schema**
   - Open: `supabase/migrations/001_initial_schema.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click **Run** button
   - Wait for success message (creates 8 tables)

3. **Run Migration 2: RLS Policies**
   - Open: `supabase/migrations/002_rls_policies.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click **Run** button
   - Wait for success message (creates security policies)

4. **Run Migration 3: Database Functions**
   - Open: `supabase/migrations/003_functions.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click **Run** button
   - Wait for success message (creates 11 functions)

### Important Notes

- **Run migrations in order**: 001 → 002 → 003
- Each migration must complete successfully before running the next
- If you get errors, check the error message and fix before proceeding

## Step 2: Verify Tables Created

After running all 3 migrations:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see 8 tables:
   - users
   - commissions
   - bids
   - milestones
   - milestone_submissions
   - payment_transactions
   - nft_certificates
   - reputation_logs

## Step 3: Run Test Script

Back in your terminal, run:

```bash
pnpm run db:test
```

**Expected Output**:
```
🧪 Testing Bring2Life Database
============================================================

📋 Test 1: Checking tables...
   ✅ users table exists
   ✅ commissions table exists
   ✅ bids table exists
   ✅ milestones table exists
   ✅ milestone_submissions table exists
   ✅ payment_transactions table exists
   ✅ nft_certificates table exists
   ✅ reputation_logs table exists

👤 Test 2: Creating test user...
   ✅ User created: [uuid]

🎨 Test 3: Creating test commission...
   ✅ Commission created: [uuid]

💼 Test 4: Submitting test bid...
   ✅ Bid submitted: [uuid]

✅ Test 5: Accepting bid...
   ✅ Bid accepted successfully

🔒 Test 6: Checking RLS policies...
   ✅ RLS policies active (query successful)

🧹 Test 7: Cleaning up test data...
   ✅ Test data cleaned up

============================================================

📊 Test Results:
   ✅ Passed: 14
   ❌ Failed: 0
   📈 Success Rate: 100.0%

🎉 All tests passed! Database is ready.
```

## Step 4: After Successful Tests

Once all tests pass, **Phase 1 is complete!**

You can then proceed to **Phase 2: Authentication & User Management** using this prompt:

```
Please implement Phase 2: Authentication & User Management as outlined in IMPLEMENTATION_ROADMAP.md. Focus on:
1. Web3Auth integration with Hedera wallet support
2. User profile management (create, read, update)
3. Wallet connection and authentication flow
4. Session management
5. Protected routes and auth middleware

Use the corrected terminology from the SRS: commissions, bids, milestones, milestone_submissions.
```

## Troubleshooting

### Error: "relation already exists"
- Tables already created from previous attempt
- You can either:
  - Drop existing tables first (careful!)
  - Skip to the migration that failed

### Error: "permission denied"
- Make sure you're using the service role key in .env.local
- Check that SUPABASE_SERVICE_ROLE_KEY is set correctly

### Error: "function does not exist"
- Make sure migration 003 ran successfully
- Check SQL Editor for any error messages

### Still Having Issues?
- Check `supabase/README.md` for detailed troubleshooting
- Verify all credentials in `.env.local` using: `pnpm run verify-config`

## What Migrations Do

**001_initial_schema.sql** (226 lines):
- Creates uuid extension
- Creates 8 core tables with relationships
- Sets up indexes for performance
- Adds constraints and validations

**002_rls_policies.sql** (193 lines):
- Enables Row Level Security on all tables
- Creates SELECT, INSERT, UPDATE, DELETE policies
- Ensures users can only access their own data
- Allows public viewing of open commissions

**003_functions.sql** (434 lines):
- create_user_profile: Register new users
- create_commission: Post new commissions
- submit_bid: Artists submit proposals
- accept_bid: Clients accept bids
- approve_milestone: Approve and release payment
- complete_commission: Mark commission done
- update_reputation: Calculate reputation scores
- get_commission_details: Fetch full commission data
- get_user_stats: Get user statistics
- get_leaderboard: Top artists/clients
- cancel_commission: Cancel open commissions

## Phase 1 Completion Checklist

- [x] Database schema created (8 tables)
- [x] RLS policies implemented
- [x] Database functions created (11 functions)
- [x] Supabase client utilities
- [x] TypeScript types for database
- [x] API routes (commissions, IPFS)
- [x] IPFS integration (Pinata)
- [x] Testing script created
- [ ] **Migrations run in Supabase** ← YOU ARE HERE
- [ ] **Database tests passing**

---

**Ready?** Start with Step 1 above to run the migrations!
