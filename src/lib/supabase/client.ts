/**
 * Supabase Client Configuration
 * Provides browser and server-side clients for database operations
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase configuration from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Browser/Client-side Supabase client
 * Uses anon key with Row Level Security
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Server-side Supabase client (with service role)
 * Bypasses RLS - use carefully, only on server
 */
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

/**
 * Create a Supabase client for API routes
 * This function creates a new client for each request
 */
export function createServerClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export type { Database };
