-- Bring2Life Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- Description: Set up RLS policies for data security and access control

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Public read for basic profile info (for discovery)
CREATE POLICY "Users are viewable by everyone"
    ON users FOR SELECT
    USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Users cannot delete their own profile (admin only)
CREATE POLICY "Users cannot delete profiles"
    ON users FOR DELETE
    USING (false);

-- ============================================
-- COMMISSIONS TABLE POLICIES
-- ============================================

-- Everyone can view open commissions
CREATE POLICY "Open commissions are viewable by everyone"
    ON commissions FOR SELECT
    USING (
        status = 'open' OR
        client_id = auth.uid() OR
        artist_id = auth.uid()
    );

-- Only authenticated users can create commissions
CREATE POLICY "Authenticated users can create commissions"
    ON commissions FOR INSERT
    TO authenticated
    WITH CHECK (client_id = auth.uid());

-- Clients can update their own commissions
CREATE POLICY "Clients can update their commissions"
    ON commissions FOR UPDATE
    USING (client_id = auth.uid());

-- Clients can cancel their commissions (soft delete via status)
CREATE POLICY "Clients can cancel their commissions"
    ON commissions FOR UPDATE
    USING (client_id = auth.uid() AND status = 'open');

-- ============================================
-- BIDS TABLE POLICIES
-- ============================================

-- Commission client and bid artist can view bids
CREATE POLICY "Bids viewable by commission client and artist"
    ON bids FOR SELECT
    USING (
        artist_id = auth.uid() OR
        commission_id IN (
            SELECT id FROM commissions WHERE client_id = auth.uid()
        )
    );

-- Artists can create bids on open commissions
CREATE POLICY "Artists can create bids"
    ON bids FOR INSERT
    TO authenticated
    WITH CHECK (
        artist_id = auth.uid() AND
        commission_id IN (
            SELECT id FROM commissions WHERE status = 'open'
        )
    );

-- Artists can update their own pending bids
CREATE POLICY "Artists can update their pending bids"
    ON bids FOR UPDATE
    USING (
        artist_id = auth.uid() AND
        status = 'pending'
    );

-- Artists can withdraw their bids
CREATE POLICY "Artists can withdraw their bids"
    ON bids FOR UPDATE
    USING (
        artist_id = auth.uid() AND
        status IN ('pending', 'rejected')
    );

-- ============================================
-- MILESTONES TABLE POLICIES
-- ============================================

-- Milestones viewable by commission participants
CREATE POLICY "Milestones viewable by commission participants"
    ON milestones FOR SELECT
    USING (
        commission_id IN (
            SELECT id FROM commissions
            WHERE client_id = auth.uid() OR artist_id = auth.uid()
        )
    );

-- Clients can create milestones for their commissions
CREATE POLICY "Clients can create milestones"
    ON milestones FOR INSERT
    TO authenticated
    WITH CHECK (
        commission_id IN (
            SELECT id FROM commissions WHERE client_id = auth.uid()
        )
    );

-- Clients and artists can update milestone status
CREATE POLICY "Participants can update milestones"
    ON milestones FOR UPDATE
    USING (
        commission_id IN (
            SELECT id FROM commissions
            WHERE client_id = auth.uid() OR artist_id = auth.uid()
        )
    );

-- ============================================
-- MILESTONE_SUBMISSIONS TABLE POLICIES
-- ============================================

-- Submissions viewable by commission participants
CREATE POLICY "Submissions viewable by participants"
    ON milestone_submissions FOR SELECT
    USING (
        commission_id IN (
            SELECT id FROM commissions
            WHERE client_id = auth.uid() OR artist_id = auth.uid()
        )
    );

-- Artists can create submissions for their commissions
CREATE POLICY "Artists can create submissions"
    ON milestone_submissions FOR INSERT
    TO authenticated
    WITH CHECK (
        artist_id = auth.uid() AND
        commission_id IN (
            SELECT id FROM commissions WHERE artist_id = auth.uid()
        )
    );

-- Artists can update their own submissions
CREATE POLICY "Artists can update their submissions"
    ON milestone_submissions FOR UPDATE
    USING (artist_id = auth.uid());

-- ============================================
-- PAYMENT_TRANSACTIONS TABLE POLICIES
-- ============================================

-- Users can view their own transactions
CREATE POLICY "Users can view their transactions"
    ON payment_transactions FOR SELECT
    USING (
        from_user_id = auth.uid() OR
        to_user_id = auth.uid()
    );

-- System/API creates transactions (not users directly)
CREATE POLICY "Only service role can insert transactions"
    ON payment_transactions FOR INSERT
    TO service_role
    WITH CHECK (true);

-- No updates to transactions (immutable)
CREATE POLICY "Transactions are immutable"
    ON payment_transactions FOR UPDATE
    USING (false);

-- No deletes
CREATE POLICY "Transactions cannot be deleted"
    ON payment_transactions FOR DELETE
    USING (false);

-- ============================================
-- NFT_CERTIFICATES TABLE POLICIES
-- ============================================

-- NFTs are publicly viewable (for transparency)
CREATE POLICY "NFT certificates are publicly viewable"
    ON nft_certificates FOR SELECT
    USING (true);

-- Only service role can mint NFTs
CREATE POLICY "Only service role can create NFT certificates"
    ON nft_certificates FOR INSERT
    TO service_role
    WITH CHECK (true);

-- NFTs are immutable
CREATE POLICY "NFT certificates are immutable"
    ON nft_certificates FOR UPDATE
    USING (false);

CREATE POLICY "NFT certificates cannot be deleted"
    ON nft_certificates FOR DELETE
    USING (false);

-- ============================================
-- REPUTATION_LOGS TABLE POLICIES
-- ============================================

-- Users can view their own reputation logs
CREATE POLICY "Users can view their reputation logs"
    ON reputation_logs FOR SELECT
    USING (user_id = auth.uid());

-- Public read for transparency
CREATE POLICY "Reputation logs are publicly viewable"
    ON reputation_logs FOR SELECT
    USING (true);

-- Only service role can insert reputation logs
CREATE POLICY "Only service role can create reputation logs"
    ON reputation_logs FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Reputation logs are immutable
CREATE POLICY "Reputation logs are immutable"
    ON reputation_logs FOR UPDATE
    USING (false);

CREATE POLICY "Reputation logs cannot be deleted"
    ON reputation_logs FOR DELETE
    USING (false);

-- ============================================
-- HELPER FUNCTION: Check if user is commission participant
-- ============================================

CREATE OR REPLACE FUNCTION is_commission_participant(commission_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM commissions
        WHERE id = commission_uuid
        AND (client_id = auth.uid() OR artist_id = auth.uid())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON POLICY "Users are viewable by everyone" ON users IS
    'Public profiles for artist discovery and transparency';

COMMENT ON POLICY "Open commissions are viewable by everyone" ON commissions IS
    'Open commissions visible to all for bidding; in-progress visible to participants only';

COMMENT ON POLICY "Only service role can insert transactions" ON payment_transactions IS
    'Transactions created by backend after Hedera blockchain confirmation';

COMMENT ON POLICY "NFT certificates are publicly viewable" ON nft_certificates IS
    'NFTs are public for provenance and authenticity verification';
