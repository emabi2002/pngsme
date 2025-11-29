#!/usr/bin/env bun

/**
 * Supabase Database Connection Test
 *
 * This script tests the connection to your Supabase database
 * and verifies that all tables and data are set up correctly.
 *
 * Run with: bun run scripts/test-db-connection.ts
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in environment variables');
  console.error('Make sure .env.local file exists with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testConnection() {
  log('\n🔍 Testing Supabase Connection...', 'cyan');
  log(`📡 URL: ${supabaseUrl}`, 'blue');
  log('');

  let testsPassd = 0;
  let testsFailed = 0;

  // Test 1: Fetch categories
  log('Test 1: Fetching categories...', 'yellow');
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*');

    if (error) throw error;

    if (categories && categories.length === 11) {
      log(`✅ Success: Found ${categories.length} categories`, 'green');
      log(`   Categories: ${categories.map(c => c.name).join(', ')}`, 'blue');
      testsPassd++;
    } else {
      log(`⚠️  Warning: Expected 11 categories, found ${categories?.length || 0}`, 'yellow');
      testsFailed++;
    }
  } catch (error) {
    log(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'red');
    testsFailed++;
  }

  // Test 2: Check if tables exist
  log('\nTest 2: Checking database tables...', 'yellow');
  const tables = [
    'users', 'businesses', 'categories', 'products', 'product_images',
    'product_variants', 'orders', 'order_items', 'reviews', 'memberships',
    'delivery_providers', 'deliveries', 'wallets', 'wallet_transactions',
    'payout_requests', 'training_modules', 'support_tickets', 'announcements'
  ];

  let tablesFound = 0;
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(0);

      if (!error) {
        tablesFound++;
      }
    } catch {
      // Table doesn't exist
    }
  }

  if (tablesFound === tables.length) {
    log(`✅ Success: All ${tables.length} tables exist`, 'green');
    testsPassd++;
  } else {
    log(`❌ Failed: Found ${tablesFound}/${tables.length} tables`, 'red');
    log(`   Missing tables - run .same/supabase-schema.sql`, 'yellow');
    testsFailed++;
  }

  // Test 3: Check storage buckets
  log('\nTest 3: Checking storage buckets...', 'yellow');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) throw error;

    const requiredBuckets = ['product-images', 'business-logos', 'business-covers'];
    const foundBuckets = buckets?.map(b => b.name) || [];
    const missingBuckets = requiredBuckets.filter(b => !foundBuckets.includes(b));

    if (missingBuckets.length === 0) {
      log(`✅ Success: All storage buckets exist`, 'green');
      log(`   Buckets: ${foundBuckets.join(', ')}`, 'blue');
      testsPassd++;
    } else {
      log(`⚠️  Warning: Missing buckets: ${missingBuckets.join(', ')}`, 'yellow');
      log(`   Run .same/supabase-storage-setup.sql`, 'yellow');
      testsFailed++;
    }
  } catch (error) {
    log(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'red');
    testsFailed++;
  }

  // Test 4: Check products table
  log('\nTest 4: Checking products table...', 'yellow');
  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    log(`✅ Success: Products table accessible (${count || 0} products)`, 'green');
    if (count === 0) {
      log(`   ℹ️  No products yet - add some via /seller/products/new`, 'blue');
    }
    testsPassd++;
  } catch (error) {
    log(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'red');
    testsFailed++;
  }

  // Test 5: Check businesses table
  log('\nTest 5: Checking businesses table...', 'yellow');
  try {
    const { count, error } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    log(`✅ Success: Businesses table accessible (${count || 0} businesses)`, 'green');
    if (count === 0) {
      log(`   ℹ️  No businesses yet - register via /seller/register`, 'blue');
    }
    testsPassd++;
  } catch (error) {
    log(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'red');
    testsFailed++;
  }

  // Summary
  log('\n' + '='.repeat(50), 'cyan');
  log(`📊 Test Summary:`, 'cyan');
  log(`   ✅ Passed: ${testsPassd}`, 'green');
  log(`   ❌ Failed: ${testsFailed}`, testsFailed > 0 ? 'red' : 'green');
  log('='.repeat(50), 'cyan');

  if (testsFailed === 0) {
    log('\n🎉 All tests passed! Your Supabase database is ready!', 'green');
    log('\nNext steps:', 'cyan');
    log('1. Register a seller account at /register', 'blue');
    log('2. Create a business at /seller/register', 'blue');
    log('3. Add products at /seller/products/new', 'blue');
    log('4. Browse marketplace at /marketplace', 'blue');
  } else {
    log('\n⚠️  Some tests failed. Please check the errors above.', 'yellow');
    log('\nTo fix:', 'cyan');
    log('1. Run .same/supabase-schema.sql in Supabase SQL Editor', 'blue');
    log('2. Run .same/supabase-storage-setup.sql in Supabase SQL Editor', 'blue');
    log('3. Restart your dev server', 'blue');
    log('4. Run this script again', 'blue');
  }

  log('');
}

// Run the tests
testConnection().catch(error => {
  log(`\n❌ Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'red');
  process.exit(1);
});
