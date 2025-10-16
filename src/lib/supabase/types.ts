/**
 * Supabase Database Types
 * Auto-generated types for type-safe database operations
 *
 * To regenerate: pnpm run db:types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          wallet_address: string
          email: string | null
          username: string | null
          full_name: string | null
          role: 'client' | 'artist' | 'both'
          avatar_url: string | null
          bio: string | null
          location: string | null
          website: string | null
          portfolio_urls: string[] | null
          specializations: string[] | null
          hourly_rate: number | null
          reputation_score: number
          total_commissions_completed: number
          total_commissions_as_client: number
          total_commissions_as_artist: number
          hedera_account_id: string | null
          created_at: string
          updated_at: string
          last_active_at: string
          is_verified: boolean
          kyc_verified: boolean
        }
        Insert: {
          id?: string
          wallet_address: string
          email?: string | null
          username?: string | null
          full_name?: string | null
          role: 'client' | 'artist' | 'both'
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          portfolio_urls?: string[] | null
          specializations?: string[] | null
          hourly_rate?: number | null
          reputation_score?: number
          total_commissions_completed?: number
          total_commissions_as_client?: number
          total_commissions_as_artist?: number
          hedera_account_id?: string | null
          created_at?: string
          updated_at?: string
          last_active_at?: string
          is_verified?: boolean
          kyc_verified?: boolean
        }
        Update: {
          id?: string
          wallet_address?: string
          email?: string | null
          username?: string | null
          full_name?: string | null
          role?: 'client' | 'artist' | 'both'
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          portfolio_urls?: string[] | null
          specializations?: string[] | null
          hourly_rate?: number | null
          reputation_score?: number
          total_commissions_completed?: number
          total_commissions_as_client?: number
          total_commissions_as_artist?: number
          hedera_account_id?: string | null
          created_at?: string
          updated_at?: string
          last_active_at?: string
          is_verified?: boolean
          kyc_verified?: boolean
        }
      }
      commissions: {
        Row: {
          id: string
          client_id: string
          artist_id: string | null
          title: string
          description: string
          category: 'portrait' | 'landscape' | 'abstract' | 'digital' | 'sculpture' | 'other'
          reference_images: string[] | null
          metadata_cid: string | null
          budget: number
          currency: string
          deadline: string
          estimated_hours: number | null
          status: 'open' | 'in_progress' | 'in_review' | 'completed' | 'cancelled' | 'disputed'
          escrow_contract_address: string | null
          escrow_transaction_id: string | null
          total_milestones: number
          completed_milestones: number
          nft_minted: boolean
          nft_token_id: string | null
          nft_serial_number: number | null
          created_at: string
          updated_at: string
          started_at: string | null
          completed_at: string | null
          bid_count: number
          view_count: number
        }
        Insert: {
          id?: string
          client_id: string
          artist_id?: string | null
          title: string
          description: string
          category: 'portrait' | 'landscape' | 'abstract' | 'digital' | 'sculpture' | 'other'
          reference_images?: string[] | null
          metadata_cid?: string | null
          budget: number
          currency?: string
          deadline: string
          estimated_hours?: number | null
          status?: 'open' | 'in_progress' | 'in_review' | 'completed' | 'cancelled' | 'disputed'
          escrow_contract_address?: string | null
          escrow_transaction_id?: string | null
          total_milestones?: number
          completed_milestones?: number
          nft_minted?: boolean
          nft_token_id?: string | null
          nft_serial_number?: number | null
          created_at?: string
          updated_at?: string
          started_at?: string | null
          completed_at?: string | null
          bid_count?: number
          view_count?: number
        }
        Update: {
          id?: string
          client_id?: string
          artist_id?: string | null
          title?: string
          description?: string
          category?: 'portrait' | 'landscape' | 'abstract' | 'digital' | 'sculpture' | 'other'
          reference_images?: string[] | null
          metadata_cid?: string | null
          budget?: number
          currency?: string
          deadline?: string
          estimated_hours?: number | null
          status?: 'open' | 'in_progress' | 'in_review' | 'completed' | 'cancelled' | 'disputed'
          escrow_contract_address?: string | null
          escrow_transaction_id?: string | null
          total_milestones?: number
          completed_milestones?: number
          nft_minted?: boolean
          nft_token_id?: string | null
          nft_serial_number?: number | null
          created_at?: string
          updated_at?: string
          started_at?: string | null
          completed_at?: string | null
          bid_count?: number
          view_count?: number
        }
      }
      bids: {
        Row: {
          id: string
          commission_id: string
          artist_id: string
          proposed_amount: number
          proposed_timeline: number
          cover_letter: string
          portfolio_samples: string[] | null
          milestone_breakdown: Json | null
          status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          staked_amount: number
          created_at: string
          updated_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          commission_id: string
          artist_id: string
          proposed_amount: number
          proposed_timeline: number
          cover_letter: string
          portfolio_samples?: string[] | null
          milestone_breakdown?: Json | null
          status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          staked_amount?: number
          created_at?: string
          updated_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          commission_id?: string
          artist_id?: string
          proposed_amount?: number
          proposed_timeline?: number
          cover_letter?: string
          portfolio_samples?: string[] | null
          milestone_breakdown?: Json | null
          status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          staked_amount?: number
          created_at?: string
          updated_at?: string
          reviewed_at?: string | null
        }
      }
      milestones: {
        Row: {
          id: string
          commission_id: string
          title: string
          description: string
          order_index: number
          amount: number
          estimated_days: number | null
          deadline: string | null
          status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'paid'
          created_at: string
          updated_at: string
          submitted_at: string | null
          approved_at: string | null
        }
        Insert: {
          id?: string
          commission_id: string
          title: string
          description: string
          order_index: number
          amount: number
          estimated_days?: number | null
          deadline?: string | null
          status?: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'paid'
          created_at?: string
          updated_at?: string
          submitted_at?: string | null
          approved_at?: string | null
        }
        Update: {
          id?: string
          commission_id?: string
          title?: string
          description?: string
          order_index?: number
          amount?: number
          estimated_days?: number | null
          deadline?: string | null
          status?: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'paid'
          created_at?: string
          updated_at?: string
          submitted_at?: string | null
          approved_at?: string | null
        }
      }
      milestone_submissions: {
        Row: {
          id: string
          milestone_id: string
          commission_id: string
          artist_id: string
          work_url: string
          description: string | null
          notes_for_client: string | null
          additional_files: string[] | null
          client_feedback: string | null
          revision_requested: boolean
          revision_notes: string | null
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          milestone_id: string
          commission_id: string
          artist_id: string
          work_url: string
          description?: string | null
          notes_for_client?: string | null
          additional_files?: string[] | null
          client_feedback?: string | null
          revision_requested?: boolean
          revision_notes?: string | null
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          milestone_id?: string
          commission_id?: string
          artist_id?: string
          work_url?: string
          description?: string | null
          notes_for_client?: string | null
          additional_files?: string[] | null
          client_feedback?: string | null
          revision_requested?: boolean
          revision_notes?: string | null
          created_at?: string
          reviewed_at?: string | null
        }
      }
      payment_transactions: {
        Row: {
          id: string
          commission_id: string
          milestone_id: string | null
          from_user_id: string
          to_user_id: string
          amount: number
          currency: string
          transaction_type: 'escrow_deposit' | 'milestone_payment' | 'refund' | 'platform_fee'
          hedera_transaction_id: string | null
          hedera_timestamp: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          platform_fee_amount: number
          platform_fee_percent: number
          created_at: string
          completed_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          commission_id: string
          milestone_id?: string | null
          from_user_id: string
          to_user_id: string
          amount: number
          currency?: string
          transaction_type: 'escrow_deposit' | 'milestone_payment' | 'refund' | 'platform_fee'
          hedera_transaction_id?: string | null
          hedera_timestamp?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          platform_fee_amount?: number
          platform_fee_percent?: number
          created_at?: string
          completed_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          commission_id?: string
          milestone_id?: string | null
          from_user_id?: string
          to_user_id?: string
          amount?: number
          currency?: string
          transaction_type?: 'escrow_deposit' | 'milestone_payment' | 'refund' | 'platform_fee'
          hedera_transaction_id?: string | null
          hedera_timestamp?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          platform_fee_amount?: number
          platform_fee_percent?: number
          created_at?: string
          completed_at?: string | null
          metadata?: Json | null
        }
      }
      nft_certificates: {
        Row: {
          id: string
          commission_id: string
          client_id: string
          artist_id: string
          token_id: string
          serial_number: number
          metadata_cid: string
          artwork_title: string
          artwork_description: string | null
          artwork_cid: string
          royalty_percent: number
          minted_at: string
          transaction_id: string | null
        }
        Insert: {
          id?: string
          commission_id: string
          client_id: string
          artist_id: string
          token_id: string
          serial_number: number
          metadata_cid: string
          artwork_title: string
          artwork_description?: string | null
          artwork_cid: string
          royalty_percent?: number
          minted_at?: string
          transaction_id?: string | null
        }
        Update: {
          id?: string
          commission_id?: string
          client_id?: string
          artist_id?: string
          token_id?: string
          serial_number?: number
          metadata_cid?: string
          artwork_title?: string
          artwork_description?: string | null
          artwork_cid?: string
          royalty_percent?: number
          minted_at?: string
          transaction_id?: string | null
        }
      }
      reputation_logs: {
        Row: {
          id: string
          user_id: string
          commission_id: string | null
          event_type: string
          reputation_change: number
          new_reputation_score: number
          rating: number | null
          review_text: string | null
          reviewer_id: string | null
          hcs_topic_id: string | null
          hcs_sequence_number: number | null
          hcs_timestamp: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          commission_id?: string | null
          event_type: string
          reputation_change: number
          new_reputation_score: number
          rating?: number | null
          review_text?: string | null
          reviewer_id?: string | null
          hcs_topic_id?: string | null
          hcs_sequence_number?: number | null
          hcs_timestamp?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          commission_id?: string | null
          event_type?: string
          reputation_change?: number
          new_reputation_score?: number
          rating?: number | null
          review_text?: string | null
          reviewer_id?: string | null
          hcs_topic_id?: string | null
          hcs_sequence_number?: number | null
          hcs_timestamp?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_profile: {
        Args: {
          p_wallet_address: string
          p_email?: string
          p_username?: string
          p_full_name?: string
          p_role?: string
          p_hedera_account_id?: string
        }
        Returns: string
      }
      create_commission: {
        Args: {
          p_client_id: string
          p_title: string
          p_description: string
          p_category: string
          p_budget: number
          p_deadline: string
          p_reference_images?: string[]
          p_metadata_cid?: string
        }
        Returns: string
      }
      submit_bid: {
        Args: {
          p_commission_id: string
          p_artist_id: string
          p_proposed_amount: number
          p_proposed_timeline: number
          p_cover_letter: string
          p_portfolio_samples?: string[]
          p_milestone_breakdown?: Json
        }
        Returns: string
      }
      accept_bid: {
        Args: {
          p_bid_id: string
          p_client_id: string
        }
        Returns: boolean
      }
      approve_milestone: {
        Args: {
          p_milestone_id: string
          p_client_id: string
          p_feedback?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
