# Supabase Database Setup

## Running Migrations

The database migrations are in `supabase/migrations/` folder.

### Method 1: Supabase Dashboard (Recommended for Quick Setup)

1. Go to your Supabase project: https://supabase.com/dashboard/project/rkbfjfuxtugyidfxcmkz

2. Navigate to **SQL Editor** in the left sidebar

3. Run migrations in order:

   **Step 1: Initial Schema**
   ```sql
   -- Copy and paste contents of migrations/001_initial_schema.sql
   -- Click "Run"
   ```

   **Step 2: RLS Policies**
   ```sql
   -- Copy and paste contents of migrations/002_rls_policies.sql
   -- Click "Run"
   ```

   **Step 3: Database Functions**
   ```sql
   -- Copy and paste contents of migrations/003_functions.sql
   -- Click "Run"
   ```

### Method 2: Supabase CLI (For Production)

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login**:
   ```bash
   supabase login
   ```

3. **Link Project**:
   ```bash
   supabase link --project-ref rkbfjfuxtugyidfxcmkz
   ```

4. **Run Migrations**:
   ```bash
   supabase db push
   ```

## Verifying Setup

After running migrations, verify tables are created:

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

## Generating TypeScript Types

After migrations are complete, generate TypeScript types:

```bash
pnpm run db:types
```

This will update `src/lib/supabase/types.ts` with the actual database schema.

## Seeding Test Data (Optional)

To seed test data for development:

```bash
pnpm run db:seed
```

## Database Schema

### Tables Overview

| Table | Purpose |
|-------|---------|
| users | User accounts and profiles |
| commissions | Art commission requests |
| bids | Artist proposals on commissions |
| milestones | Commission milestone definitions |
| milestone_submissions | Artist work submissions |
| payment_transactions | Payment history |
| nft_certificates | Minted NFT records |
| reputation_logs | Reputation event logs |

### Key Functions

| Function | Purpose |
|----------|---------|
| create_user_profile | Create new user |
| create_commission | Create art commission |
| submit_bid | Submit artist bid |
| accept_bid | Accept bid and start commission |
| approve_milestone | Approve milestone and release payment |
| complete_commission | Mark commission as complete |
| update_reputation | Update user reputation score |

## Troubleshooting

### Error: "relation does not exist"
- Make sure migrations are run in order (001, 002, 003)

### Error: "permission denied"
- Check that RLS policies are enabled
- Verify user authentication

### Error: "function does not exist"
- Ensure 003_functions.sql was run successfully

## Next Steps

After database setup:
1. Test API routes: `pnpm run test:api`
2. Proceed to Phase 2: Authentication
