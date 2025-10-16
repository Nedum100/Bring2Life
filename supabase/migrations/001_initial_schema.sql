-- Bring2Life Database Schema
-- Migration: 001_initial_schema.sql
-- Description: Create all core tables for art commission platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('client', 'artist', 'both')),
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,

    -- Artist-specific fields
    portfolio_urls TEXT[], -- Array of IPFS URLs
    specializations TEXT[], -- e.g., ['portrait', 'landscape', 'digital']
    hourly_rate DECIMAL(10, 2),

    -- Reputation
    reputation_score DECIMAL(5, 2) DEFAULT 0.00,
    total_commissions_completed INTEGER DEFAULT 0,
    total_commissions_as_client INTEGER DEFAULT 0,
    total_commissions_as_artist INTEGER DEFAULT 0,

    -- Hedera integration
    hedera_account_id TEXT, -- 0.0.xxxxx format

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    kyc_verified BOOLEAN DEFAULT FALSE
);

-- ============================================
-- COMMISSIONS TABLE
-- ============================================
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Relationships
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Set after bid acceptance

    -- Commission details
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('portrait', 'landscape', 'abstract', 'digital', 'sculpture', 'other')),
    reference_images TEXT[], -- IPFS CIDs
    metadata_cid TEXT, -- IPFS CID for full metadata JSON

    -- Pricing
    budget DECIMAL(10, 2) NOT NULL CHECK (budget > 0),
    currency TEXT DEFAULT 'HBAR' CHECK (currency IN ('HBAR', 'USD')),

    -- Timeline
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_hours DECIMAL(5, 1),

    -- Status
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
        'open',           -- Accepting bids
        'in_progress',    -- Artist working
        'in_review',      -- Client reviewing
        'completed',      -- Finished successfully
        'cancelled',      -- Cancelled by client
        'disputed'        -- In dispute resolution
    )),

    -- Contract integration
    escrow_contract_address TEXT, -- Hedera smart contract address
    escrow_transaction_id TEXT,   -- Transaction ID of contract creation

    -- Milestone tracking
    total_milestones INTEGER DEFAULT 0,
    completed_milestones INTEGER DEFAULT 0,

    -- NFT
    nft_minted BOOLEAN DEFAULT FALSE,
    nft_token_id TEXT,
    nft_serial_number BIGINT,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Counters
    bid_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0
);

-- ============================================
-- BIDS TABLE
-- ============================================
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Relationships
    commission_id UUID NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Bid details
    proposed_amount DECIMAL(10, 2) NOT NULL CHECK (proposed_amount > 0),
    proposed_timeline INTEGER NOT NULL CHECK (proposed_timeline > 0), -- in days
    cover_letter TEXT NOT NULL,
    portfolio_samples TEXT[], -- IPFS CIDs of relevant work

    -- Milestone proposal
    milestone_breakdown JSONB, -- Detailed milestone plan

    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',   -- Awaiting client review
        'accepted',  -- Client accepted
        'rejected',  -- Client rejected
        'withdrawn'  -- Artist withdrew
    )),

    -- Staking (future feature)
    staked_amount DECIMAL(10, 2) DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    UNIQUE(commission_id, artist_id) -- One bid per artist per commission
);

-- ============================================
-- MILESTONES TABLE
-- ============================================
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Relationships
    commission_id UUID NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,

    -- Milestone details
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL, -- 1, 2, 3, etc.
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),

    -- Timeline
    estimated_days INTEGER,
    deadline TIMESTAMP WITH TIME ZONE,

    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',    -- Not started
        'in_progress',-- Artist working
        'submitted',  -- Artist submitted work
        'approved',   -- Client approved
        'rejected',   -- Client rejected
        'paid'        -- Payment released
    )),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    UNIQUE(commission_id, order_index)
);

-- ============================================
-- MILESTONE_SUBMISSIONS TABLE
-- ============================================
CREATE TABLE milestone_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Relationships
    milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
    commission_id UUID NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Submission details
    work_url TEXT NOT NULL, -- IPFS CID
    description TEXT,
    notes_for_client TEXT,

    -- Additional files
    additional_files TEXT[], -- Array of IPFS CIDs

    -- Review
    client_feedback TEXT,
    revision_requested BOOLEAN DEFAULT FALSE,
    revision_notes TEXT,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- PAYMENT_TRANSACTIONS TABLE
-- ============================================
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Relationships
    commission_id UUID NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Transaction details
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency TEXT DEFAULT 'HBAR' CHECK (currency IN ('HBAR', 'USD')),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'escrow_deposit',    -- Client deposits to escrow
        'milestone_payment', -- Payment released to artist
        'refund',           -- Refund to client
        'platform_fee'      -- Platform fee collection
    )),

    -- Hedera integration
    hedera_transaction_id TEXT,
    hedera_timestamp TIMESTAMP WITH TIME ZONE,

    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'processing',
        'completed',
        'failed',
        'refunded'
    )),

    -- Platform fee
    platform_fee_amount DECIMAL(10, 2) DEFAULT 0,
    platform_fee_percent DECIMAL(5, 2) DEFAULT 2.5,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Additional data
    metadata JSONB
);

-- ============================================
-- NFT_CERTIFICATES TABLE
-- ============================================
CREATE TABLE nft_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Relationships
    commission_id UUID UNIQUE NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- NFT details
    token_id TEXT NOT NULL, -- Hedera token ID
    serial_number BIGINT NOT NULL,
    metadata_cid TEXT NOT NULL, -- IPFS CID for NFT metadata JSON

    -- Artwork details
    artwork_title TEXT NOT NULL,
    artwork_description TEXT,
    artwork_cid TEXT NOT NULL, -- IPFS CID of final artwork

    -- Royalty configuration
    royalty_percent DECIMAL(5, 2) DEFAULT 5.0,

    -- Metadata
    minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    transaction_id TEXT,

    -- Constraints
    UNIQUE(token_id, serial_number)
);

-- ============================================
-- REPUTATION_LOGS TABLE
-- ============================================
CREATE TABLE reputation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Relationships
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    commission_id UUID REFERENCES commissions(id) ON DELETE SET NULL,

    -- Event details
    event_type TEXT NOT NULL CHECK (event_type IN (
        'commission_completed',
        'commission_cancelled',
        'positive_review',
        'negative_review',
        'dispute_won',
        'dispute_lost',
        'milestone_approved',
        'milestone_rejected'
    )),

    -- Impact
    reputation_change DECIMAL(5, 2) NOT NULL,
    new_reputation_score DECIMAL(5, 2) NOT NULL,

    -- Rating (if applicable)
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Hedera Consensus Service
    hcs_topic_id TEXT,
    hcs_sequence_number BIGINT,
    hcs_timestamp TIMESTAMP WITH TIME ZONE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Users indexes
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_reputation ON users(reputation_score DESC);

-- Commissions indexes
CREATE INDEX idx_commissions_client_id ON commissions(client_id);
CREATE INDEX idx_commissions_artist_id ON commissions(artist_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_category ON commissions(category);
CREATE INDEX idx_commissions_created_at ON commissions(created_at DESC);
CREATE INDEX idx_commissions_deadline ON commissions(deadline);

-- Bids indexes
CREATE INDEX idx_bids_commission_id ON bids(commission_id);
CREATE INDEX idx_bids_artist_id ON bids(artist_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_bids_created_at ON bids(created_at DESC);

-- Milestones indexes
CREATE INDEX idx_milestones_commission_id ON milestones(commission_id);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_order ON milestones(commission_id, order_index);

-- Milestone submissions indexes
CREATE INDEX idx_submissions_milestone_id ON milestone_submissions(milestone_id);
CREATE INDEX idx_submissions_artist_id ON milestone_submissions(artist_id);

-- Transactions indexes
CREATE INDEX idx_transactions_commission_id ON payment_transactions(commission_id);
CREATE INDEX idx_transactions_from_user ON payment_transactions(from_user_id);
CREATE INDEX idx_transactions_to_user ON payment_transactions(to_user_id);
CREATE INDEX idx_transactions_status ON payment_transactions(status);
CREATE INDEX idx_transactions_created_at ON payment_transactions(created_at DESC);

-- NFT indexes
CREATE INDEX idx_nft_commission_id ON nft_certificates(commission_id);
CREATE INDEX idx_nft_client_id ON nft_certificates(client_id);
CREATE INDEX idx_nft_artist_id ON nft_certificates(artist_id);

-- Reputation logs indexes
CREATE INDEX idx_reputation_user_id ON reputation_logs(user_id);
CREATE INDEX idx_reputation_created_at ON reputation_logs(created_at DESC);

-- ============================================
-- TRIGGERS for updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS for Documentation
-- ============================================

COMMENT ON TABLE users IS 'User accounts and profiles for clients and artists';
COMMENT ON TABLE commissions IS 'Art commission requests posted by clients';
COMMENT ON TABLE bids IS 'Artist proposals for commissions';
COMMENT ON TABLE milestones IS 'Commission milestone definitions';
COMMENT ON TABLE milestone_submissions IS 'Artist work submissions for milestones';
COMMENT ON TABLE payment_transactions IS 'All payment transactions and history';
COMMENT ON TABLE nft_certificates IS 'Minted NFT certificates for completed commissions';
COMMENT ON TABLE reputation_logs IS 'Immutable reputation event logs';
