-- Bring2Life Database Functions
-- Migration: 003_functions.sql
-- Description: Create stored procedures and functions for common operations

-- ============================================
-- FUNCTION: Create User Profile
-- ============================================

CREATE OR REPLACE FUNCTION create_user_profile(
    p_wallet_address TEXT,
    p_email TEXT DEFAULT NULL,
    p_username TEXT DEFAULT NULL,
    p_full_name TEXT DEFAULT NULL,
    p_role TEXT DEFAULT 'client',
    p_hedera_account_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    INSERT INTO users (
        wallet_address,
        email,
        username,
        full_name,
        role,
        hedera_account_id
    ) VALUES (
        p_wallet_address,
        p_email,
        p_username,
        p_full_name,
        p_role,
        p_hedera_account_id
    )
    RETURNING id INTO v_user_id;

    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Create Commission
-- ============================================

CREATE OR REPLACE FUNCTION create_commission(
    p_client_id UUID,
    p_title TEXT,
    p_description TEXT,
    p_category TEXT,
    p_budget DECIMAL,
    p_deadline TIMESTAMP WITH TIME ZONE,
    p_reference_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    p_metadata_cid TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_commission_id UUID;
BEGIN
    INSERT INTO commissions (
        client_id,
        title,
        description,
        category,
        budget,
        deadline,
        reference_images,
        metadata_cid,
        status
    ) VALUES (
        p_client_id,
        p_title,
        p_description,
        p_category,
        p_budget,
        p_deadline,
        p_reference_images,
        p_metadata_cid,
        'open'
    )
    RETURNING id INTO v_commission_id;

    RETURN v_commission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Submit Bid
-- ============================================

CREATE OR REPLACE FUNCTION submit_bid(
    p_commission_id UUID,
    p_artist_id UUID,
    p_proposed_amount DECIMAL,
    p_proposed_timeline INTEGER,
    p_cover_letter TEXT,
    p_portfolio_samples TEXT[] DEFAULT ARRAY[]::TEXT[],
    p_milestone_breakdown JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_bid_id UUID;
    v_commission_status TEXT;
BEGIN
    -- Check if commission is still open
    SELECT status INTO v_commission_status
    FROM commissions
    WHERE id = p_commission_id;

    IF v_commission_status != 'open' THEN
        RAISE EXCEPTION 'Commission is not accepting bids';
    END IF;

    INSERT INTO bids (
        commission_id,
        artist_id,
        proposed_amount,
        proposed_timeline,
        cover_letter,
        portfolio_samples,
        milestone_breakdown,
        status
    ) VALUES (
        p_commission_id,
        p_artist_id,
        p_proposed_amount,
        p_proposed_timeline,
        p_cover_letter,
        p_portfolio_samples,
        p_milestone_breakdown,
        'pending'
    )
    RETURNING id INTO v_bid_id;

    -- Update commission bid count
    UPDATE commissions
    SET bid_count = bid_count + 1
    WHERE id = p_commission_id;

    RETURN v_bid_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Accept Bid
-- ============================================

CREATE OR REPLACE FUNCTION accept_bid(
    p_bid_id UUID,
    p_client_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_commission_id UUID;
    v_artist_id UUID;
    v_commission_client_id UUID;
BEGIN
    -- Get bid details
    SELECT commission_id, artist_id INTO v_commission_id, v_artist_id
    FROM bids
    WHERE id = p_bid_id AND status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Bid not found or already processed';
    END IF;

    -- Verify client owns commission
    SELECT client_id INTO v_commission_client_id
    FROM commissions
    WHERE id = v_commission_id;

    IF v_commission_client_id != p_client_id THEN
        RAISE EXCEPTION 'Only commission owner can accept bids';
    END IF;

    -- Update bid status
    UPDATE bids
    SET status = 'accepted', reviewed_at = NOW()
    WHERE id = p_bid_id;

    -- Reject all other bids
    UPDATE bids
    SET status = 'rejected', reviewed_at = NOW()
    WHERE commission_id = v_commission_id AND id != p_bid_id AND status = 'pending';

    -- Update commission
    UPDATE commissions
    SET
        artist_id = v_artist_id,
        status = 'in_progress',
        started_at = NOW()
    WHERE id = v_commission_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Create Milestones
-- ============================================

CREATE OR REPLACE FUNCTION create_milestones(
    p_commission_id UUID,
    p_milestones JSONB -- Array of {title, description, amount, estimated_days}
)
RETURNS INTEGER AS $$
DECLARE
    v_milestone JSONB;
    v_index INTEGER := 1;
    v_count INTEGER := 0;
BEGIN
    FOR v_milestone IN SELECT * FROM jsonb_array_elements(p_milestones)
    LOOP
        INSERT INTO milestones (
            commission_id,
            title,
            description,
            order_index,
            amount,
            estimated_days,
            status
        ) VALUES (
            p_commission_id,
            v_milestone->>'title',
            v_milestone->>'description',
            v_index,
            (v_milestone->>'amount')::DECIMAL,
            (v_milestone->>'estimated_days')::INTEGER,
            'pending'
        );

        v_index := v_index + 1;
        v_count := v_count + 1;
    END LOOP;

    -- Update commission total milestones
    UPDATE commissions
    SET total_milestones = v_count
    WHERE id = p_commission_id;

    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Submit Milestone
-- ============================================

CREATE OR REPLACE FUNCTION submit_milestone(
    p_milestone_id UUID,
    p_artist_id UUID,
    p_work_url TEXT,
    p_description TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_submission_id UUID;
    v_commission_id UUID;
BEGIN
    -- Get commission ID from milestone
    SELECT commission_id INTO v_commission_id
    FROM milestones
    WHERE id = p_milestone_id;

    -- Create submission
    INSERT INTO milestone_submissions (
        milestone_id,
        commission_id,
        artist_id,
        work_url,
        description,
        notes_for_client
    ) VALUES (
        p_milestone_id,
        v_commission_id,
        p_artist_id,
        p_work_url,
        p_description,
        p_notes
    )
    RETURNING id INTO v_submission_id;

    -- Update milestone status
    UPDATE milestones
    SET
        status = 'submitted',
        submitted_at = NOW()
    WHERE id = p_milestone_id;

    RETURN v_submission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Approve Milestone
-- ============================================

CREATE OR REPLACE FUNCTION approve_milestone(
    p_milestone_id UUID,
    p_client_id UUID,
    p_feedback TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_commission_id UUID;
    v_commission_client_id UUID;
BEGIN
    -- Get commission details
    SELECT m.commission_id, c.client_id
    INTO v_commission_id, v_commission_client_id
    FROM milestones m
    JOIN commissions c ON m.commission_id = c.id
    WHERE m.id = p_milestone_id;

    -- Verify client owns commission
    IF v_commission_client_id != p_client_id THEN
        RAISE EXCEPTION 'Only commission owner can approve milestones';
    END IF;

    -- Update milestone
    UPDATE milestones
    SET
        status = 'approved',
        approved_at = NOW()
    WHERE id = p_milestone_id;

    -- Update submission with feedback
    UPDATE milestone_submissions
    SET
        client_feedback = p_feedback,
        reviewed_at = NOW()
    WHERE milestone_id = p_milestone_id;

    -- Update commission completed milestones count
    UPDATE commissions
    SET completed_milestones = completed_milestones + 1
    WHERE id = v_commission_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Complete Commission
-- ============================================

CREATE OR REPLACE FUNCTION complete_commission(
    p_commission_id UUID,
    p_nft_token_id TEXT,
    p_nft_serial_number BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_client_id UUID;
    v_artist_id UUID;
BEGIN
    -- Get commission details
    SELECT client_id, artist_id
    INTO v_client_id, v_artist_id
    FROM commissions
    WHERE id = p_commission_id;

    -- Update commission status
    UPDATE commissions
    SET
        status = 'completed',
        completed_at = NOW(),
        nft_minted = TRUE,
        nft_token_id = p_nft_token_id,
        nft_serial_number = p_nft_serial_number
    WHERE id = p_commission_id;

    -- Update user statistics
    UPDATE users
    SET
        total_commissions_completed = total_commissions_completed + 1,
        total_commissions_as_client = total_commissions_as_client + 1
    WHERE id = v_client_id;

    UPDATE users
    SET
        total_commissions_completed = total_commissions_completed + 1,
        total_commissions_as_artist = total_commissions_as_artist + 1
    WHERE id = v_artist_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Update Reputation
-- ============================================

CREATE OR REPLACE FUNCTION update_reputation(
    p_user_id UUID,
    p_commission_id UUID,
    p_event_type TEXT,
    p_reputation_change DECIMAL,
    p_rating INTEGER DEFAULT NULL,
    p_review_text TEXT DEFAULT NULL,
    p_reviewer_id UUID DEFAULT NULL
)
RETURNS DECIMAL AS $$
DECLARE
    v_new_score DECIMAL;
BEGIN
    -- Calculate new reputation score
    SELECT reputation_score + p_reputation_change
    INTO v_new_score
    FROM users
    WHERE id = p_user_id;

    -- Ensure score doesn't go below 0
    v_new_score := GREATEST(v_new_score, 0);

    -- Update user reputation
    UPDATE users
    SET reputation_score = v_new_score
    WHERE id = p_user_id;

    -- Log reputation change
    INSERT INTO reputation_logs (
        user_id,
        commission_id,
        event_type,
        reputation_change,
        new_reputation_score,
        rating,
        review_text,
        reviewer_id
    ) VALUES (
        p_user_id,
        p_commission_id,
        p_event_type,
        p_reputation_change,
        v_new_score,
        p_rating,
        p_review_text,
        p_reviewer_id
    );

    RETURN v_new_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Get User Stats
-- ============================================

CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE (
    total_commissions INTEGER,
    as_client INTEGER,
    as_artist INTEGER,
    reputation DECIMAL,
    avg_rating DECIMAL,
    total_earnings DECIMAL,
    total_spent DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.total_commissions_completed,
        u.total_commissions_as_client,
        u.total_commissions_as_artist,
        u.reputation_score,
        COALESCE(AVG(r.rating)::DECIMAL(3,2), 0),
        COALESCE(SUM(CASE WHEN pt.to_user_id = p_user_id THEN pt.amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN pt.from_user_id = p_user_id THEN pt.amount ELSE 0 END), 0)
    FROM users u
    LEFT JOIN reputation_logs r ON u.id = r.user_id AND r.rating IS NOT NULL
    LEFT JOIN payment_transactions pt ON u.id = pt.from_user_id OR u.id = pt.to_user_id
    WHERE u.id = p_user_id
    GROUP BY u.id, u.total_commissions_completed, u.total_commissions_as_client,
             u.total_commissions_as_artist, u.reputation_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Get Commission with Details
-- ============================================

CREATE OR REPLACE FUNCTION get_commission_details(p_commission_id UUID)
RETURNS TABLE (
    commission JSONB,
    client JSONB,
    artist JSONB,
    milestones JSONB,
    bids JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        to_jsonb(c.*) AS commission,
        to_jsonb(client_user.*) AS client,
        to_jsonb(artist_user.*) AS artist,
        COALESCE(jsonb_agg(DISTINCT m.*) FILTER (WHERE m.id IS NOT NULL), '[]'::jsonb) AS milestones,
        COALESCE(jsonb_agg(DISTINCT b.*) FILTER (WHERE b.id IS NOT NULL), '[]'::jsonb) AS bids
    FROM commissions c
    LEFT JOIN users client_user ON c.client_id = client_user.id
    LEFT JOIN users artist_user ON c.artist_id = artist_user.id
    LEFT JOIN milestones m ON c.id = m.commission_id
    LEFT JOIN bids b ON c.id = b.commission_id
    WHERE c.id = p_commission_id
    GROUP BY c.id, client_user.id, artist_user.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON FUNCTION create_user_profile IS 'Create new user profile with basic information';
COMMENT ON FUNCTION create_commission IS 'Create new art commission request';
COMMENT ON FUNCTION submit_bid IS 'Artist submits bid on open commission';
COMMENT ON FUNCTION accept_bid IS 'Client accepts bid and starts commission';
COMMENT ON FUNCTION create_milestones IS 'Create multiple milestones for commission';
COMMENT ON FUNCTION submit_milestone IS 'Artist submits milestone work';
COMMENT ON FUNCTION approve_milestone IS 'Client approves milestone and releases payment';
COMMENT ON FUNCTION complete_commission IS 'Mark commission as completed with NFT';
COMMENT ON FUNCTION update_reputation IS 'Update user reputation score and log event';
COMMENT ON FUNCTION get_user_stats IS 'Get aggregated user statistics';
COMMENT ON FUNCTION get_commission_details IS 'Get commission with all related data';
