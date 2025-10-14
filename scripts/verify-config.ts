/**
 * Configuration Verification Script
 * Verifies all service credentials are properly configured
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

interface ConfigCheck {
  name: string;
  key: string;
  isSecret?: boolean;
  optional?: boolean;
}

const checks: ConfigCheck[] = [
  // Hedera Configuration
  { name: 'Hedera Network', key: 'NEXT_PUBLIC_HEDERA_NETWORK' },
  { name: 'Hedera Operator ID', key: 'NEXT_PUBLIC_HEDERA_OPERATOR_ID' },
  { name: 'Hedera Operator Key', key: 'NEXT_PUBLIC_HEDERA_OPERATOR_KEY', isSecret: true },
  { name: 'Hedera RPC URL', key: 'NEXT_PUBLIC_HEDERA_RPC_URL' },
  { name: 'Escrow Contract Address', key: 'NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS' },

  // Supabase Configuration
  { name: 'Supabase URL', key: 'NEXT_PUBLIC_SUPABASE_URL' },
  { name: 'Supabase Anon Key', key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', isSecret: true },
  { name: 'Supabase Service Role', key: 'SUPABASE_SERVICE_ROLE_KEY', isSecret: true },

  // Web3Auth Configuration
  { name: 'Web3Auth Client ID', key: 'NEXT_PUBLIC_WEB3AUTH_CLIENT_ID' },
  { name: 'Web3Auth Network', key: 'NEXT_PUBLIC_WEB3AUTH_NETWORK' },

  // Pinata Configuration
  { name: 'Pinata API Key', key: 'NEXT_PUBLIC_PINATA_API_KEY' },
  { name: 'Pinata API Secret', key: 'PINATA_API_SECRET', isSecret: true },
  { name: 'Pinata Gateway', key: 'NEXT_PUBLIC_PINATA_GATEWAY' },

  // Optional
  { name: '$LIFE Token Address', key: 'NEXT_PUBLIC_LIFE_TOKEN_ADDRESS', optional: true },
];

function maskSecret(value: string): string {
  if (value.length <= 8) return '****';
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function verifyConfig() {
  console.log('🔍 Verifying Bring2Life Configuration\n');
  console.log('=' .repeat(60));

  let passed = 0;
  let failed = 0;
  let optional = 0;

  checks.forEach((check) => {
    const value = process.env[check.key];
    const status = value ? '✅' : (check.optional ? '⚠️' : '❌');
    const displayValue = value
      ? (check.isSecret ? maskSecret(value) : value)
      : (check.optional ? 'Not set (optional)' : 'MISSING');

    console.log(`${status} ${check.name}`);
    console.log(`   ${check.key}: ${displayValue}\n`);

    if (value) {
      passed++;
    } else if (check.optional) {
      optional++;
    } else {
      failed++;
    }
  });

  console.log('=' .repeat(60));
  console.log(`\n📊 Results: ${passed} passed | ${failed} failed | ${optional} optional\n`);

  if (failed > 0) {
    console.log('❌ Configuration is INCOMPLETE');
    console.log('Please check your .env.local file and add missing variables.\n');
    process.exit(1);
  }

  console.log('✅ Configuration is COMPLETE');
  console.log('All required services are configured and ready!\n');

  console.log('📋 Next Steps:');
  console.log('1. Verify Hedera account has HBAR: https://hashscan.io/testnet');
  console.log('2. Verify Supabase project: https://supabase.com/dashboard');
  console.log('3. Verify Pinata account: https://pinata.cloud/');
  console.log('4. Start Phase 1: Backend Infrastructure\n');
}

// Run verification
verifyConfig();
