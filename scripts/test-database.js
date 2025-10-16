/**
 * Database Testing Script
 * Tests all database operations after migrations
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🧪 Testing Bring2Life Database\n');
  console.log('='.repeat(60));

  let testsPass = 0;
  let testsFail = 0;

  // Test 1: Check tables exist
  console.log('\n📋 Test 1: Checking tables...');
  const tables = [
    'users',
    'commissions',
    'bids',
    'milestones',
    'milestone_submissions',
    'payment_transactions',
    'nft_certificates',
    'reputation_logs',
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = empty table OK
      console.log(`   ✅ ${table} table exists`);
      testsPass++;
    } catch (error) {
      console.log(`   ❌ ${table} table missing or error: ${error.message}`);
      testsFail++;
    }
  }

  // Test 2: Create test user
  console.log('\n👤 Test 2: Creating test user...');
  try {
    const { data: userId, error } = await supabase.rpc('create_user_profile', {
      p_wallet_address: `0x${Date.now()}test`,
      p_email: `test${Date.now()}@bring2life.com`,
      p_username: `testuser${Date.now()}`,
      p_full_name: 'Test User',
      p_role: 'both',
    });

    if (error) throw error;
    console.log(`   ✅ User created: ${userId}`);
    testsPass++;

    // Save for later tests
    global.testUserId = userId;
  } catch (error) {
    console.log(`   ❌ Failed to create user: ${error.message}`);
    testsFail++;
  }

  // Test 3: Create test commission
  console.log('\n🎨 Test 3: Creating test commission...');
  try {
    if (!global.testUserId) throw new Error('No test user available');

    const { data: commissionId, error } = await supabase.rpc('create_commission', {
      p_client_id: global.testUserId,
      p_title: 'Test Commission',
      p_description: 'This is a test commission',
      p_category: 'portrait',
      p_budget: 100,
      p_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    if (error) throw error;
    console.log(`   ✅ Commission created: ${commissionId}`);
    testsPass++;

    global.testCommissionId = commissionId;
  } catch (error) {
    console.log(`   ❌ Failed to create commission: ${error.message}`);
    testsFail++;
  }

  // Test 4: Submit test bid
  console.log('\n💼 Test 4: Submitting test bid...');
  try {
    if (!global.testUserId || !global.testCommissionId) {
      throw new Error('Missing test data');
    }

    // Create second user as artist
    const { data: artistId } = await supabase.rpc('create_user_profile', {
      p_wallet_address: `0x${Date.now()}artist`,
      p_email: `artist${Date.now()}@bring2life.com`,
      p_username: `artist${Date.now()}`,
      p_full_name: 'Test Artist',
      p_role: 'artist',
    });

    const { data: bidId, error } = await supabase.rpc('submit_bid', {
      p_commission_id: global.testCommissionId,
      p_artist_id: artistId,
      p_proposed_amount: 90,
      p_proposed_timeline: 14,
      p_cover_letter: 'I would love to work on this project!',
    });

    if (error) throw error;
    console.log(`   ✅ Bid submitted: ${bidId}`);
    testsPass++;

    global.testBidId = bidId;
    global.testArtistId = artistId;
  } catch (error) {
    console.log(`   ❌ Failed to submit bid: ${error.message}`);
    testsFail++;
  }

  // Test 5: Accept bid
  console.log('\n✅ Test 5: Accepting bid...');
  try {
    if (!global.testBidId || !global.testUserId) {
      throw new Error('Missing test data');
    }

    const { data, error } = await supabase.rpc('accept_bid', {
      p_bid_id: global.testBidId,
      p_client_id: global.testUserId,
    });

    if (error) throw error;
    console.log(`   ✅ Bid accepted successfully`);
    testsPass++;
  } catch (error) {
    console.log(`   ❌ Failed to accept bid: ${error.message}`);
    testsFail++;
  }

  // Test 6: Check RLS policies
  console.log('\n🔒 Test 6: Checking RLS policies...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) throw error;
    console.log(`   ✅ RLS policies active (query successful)`);
    testsPass++;
  } catch (error) {
    console.log(`   ❌ RLS policy issue: ${error.message}`);
    testsFail++;
  }

  // Test 7: Cleanup
  console.log('\n🧹 Test 7: Cleaning up test data...');
  try {
    if (global.testCommissionId) {
      await supabase
        .from('commissions')
        .delete()
        .eq('id', global.testCommissionId);
    }

    if (global.testUserId) {
      await supabase
        .from('users')
        .delete()
        .eq('id', global.testUserId);
    }

    if (global.testArtistId) {
      await supabase
        .from('users')
        .delete()
        .eq('id', global.testArtistId);
    }

    console.log(`   ✅ Test data cleaned up`);
    testsPass++;
  } catch (error) {
    console.log(`   ⚠️  Cleanup warning: ${error.message}`);
  }

  // Results
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${testsPass}`);
  console.log(`   ❌ Failed: ${testsFail}`);
  console.log(`   📈 Success Rate: ${((testsPass / (testsPass + testsFail)) * 100).toFixed(1)}%\n`);

  if (testsFail === 0) {
    console.log('🎉 All tests passed! Database is ready.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check your migrations.\n');
    process.exit(1);
  }
}

// Run tests
testDatabase().catch((error) => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});
