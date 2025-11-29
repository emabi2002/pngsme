#!/usr/bin/env bun

/**
 * Seed Test Data Script
 *
 * Populates the PNG SME Marketplace with sample sellers, businesses, and products
 * Run with: bun run seed:data
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Sample sellers data
const sampleSellers = [
  {
    email: 'highland.fresh@test.com',
    password: 'test123',
    fullName: 'Mary Kala',
    phone: '+675 7123 4567',
    business: {
      name: 'Highland Fresh Produce',
      type: 'informal' as const,
      sectors: ['agriculture'],
      description: 'Fresh vegetables and root crops from the Eastern Highlands',
      province: 'Eastern Highlands',
      district: 'Goroka',
      cityVillage: 'Goroka Town',
      address: 'Main Market, Section 4',
      phone: '+675 7123 4567',
    },
    products: [
      {
        name: 'Fresh Kaukau (Sweet Potato)',
        description: 'Premium quality kaukau from the highlands. Rich in nutrients, perfect for traditional meals.',
        categorySlug: 'fresh-produce',
        price: 15.00,
        compareAtPrice: 20.00,
        stockQty: 100,
        unit: 'kg',
        featured: true,
      },
      {
        name: 'Fresh Taro',
        description: 'Locally grown taro, ideal for traditional dishes',
        categorySlug: 'fresh-produce',
        price: 12.00,
        stockQty: 80,
        unit: 'kg',
      },
      {
        name: 'Aibika (Green Vegetables)',
        description: 'Fresh green leafy vegetables, harvested daily',
        categorySlug: 'fresh-produce',
        price: 5.00,
        stockQty: 50,
        unit: 'bunch',
      },
    ],
  },
  {
    email: 'sepik.crafts@test.com',
    password: 'test123',
    fullName: 'John Wama',
    phone: '+675 7234 5678',
    business: {
      name: 'Sepik Handicrafts',
      type: 'informal' as const,
      sectors: ['handicrafts'],
      description: 'Authentic handwoven bilums and traditional artifacts from East Sepik',
      province: 'East Sepik',
      district: 'Wewak',
      cityVillage: 'Wewak Town',
      address: 'Craft Market Street',
      phone: '+675 7234 5678',
    },
    products: [
      {
        name: 'Traditional Bilum - Handwoven',
        description: 'Authentic handwoven bilum bag from Sepik region. Traditional patterns and colors.',
        categorySlug: 'handicrafts',
        price: 85.00,
        stockQty: 15,
        unit: 'piece',
        featured: true,
      },
      {
        name: 'Wood Carving - Traditional Mask',
        description: 'Hand-carved traditional mask, perfect for decoration',
        categorySlug: 'handicrafts',
        price: 150.00,
        stockQty: 8,
        unit: 'piece',
      },
    ],
  },
  {
    email: 'mountain.coffee@test.com',
    password: 'test123',
    fullName: 'Peter Kuma',
    phone: '+675 7345 6789',
    business: {
      name: 'Mountain Coffee Co',
      type: 'formal' as const,
      sectors: ['agriculture'],
      description: 'Premium PNG coffee beans from Western Highlands',
      province: 'Western Highlands',
      district: 'Mount Hagen',
      cityVillage: 'Mount Hagen',
      address: 'Coffee Plantation Road',
      phone: '+675 7345 6789',
      tin: 'TIN12345678',
      registrationNo: 'IPA2024001',
    },
    products: [
      {
        name: 'Organic Coffee Beans - PNG Highlands',
        description: 'Premium Arabica beans grown at 1500m altitude. Rich flavor and aroma.',
        categorySlug: 'cash-crops',
        price: 45.00,
        stockQty: 50,
        unit: 'kg',
        featured: true,
      },
      {
        name: 'Dark Roast Coffee Beans',
        description: 'Expertly roasted dark coffee beans for strong brew',
        categorySlug: 'cash-crops',
        price: 50.00,
        stockQty: 40,
        unit: 'kg',
      },
    ],
  },
  {
    email: 'coastal.naturals@test.com',
    password: 'test123',
    fullName: 'Sarah Bona',
    phone: '+675 7456 7890',
    business: {
      name: 'Coastal Naturals',
      type: 'informal' as const,
      sectors: ['food_beverage'],
      description: 'Natural coconut products from Milne Bay',
      province: 'Milne Bay',
      district: 'Alotau',
      cityVillage: 'Alotau Town',
      address: 'Coastal Road',
      phone: '+675 7456 7890',
    },
    products: [
      {
        name: 'Fresh Coconut Oil - Cold Pressed',
        description: '100% pure coconut oil, traditionally pressed. Perfect for cooking and skin care.',
        categorySlug: 'processed-foods',
        price: 25.00,
        stockQty: 30,
        unit: 'litre',
        featured: true,
      },
      {
        name: 'Coconut Chips',
        description: 'Crispy coconut chips, lightly sweetened',
        categorySlug: 'processed-foods',
        price: 15.00,
        stockQty: 40,
        unit: 'packet',
      },
    ],
  },
  {
    email: 'png.honey@test.com',
    password: 'test123',
    fullName: 'David Toka',
    phone: '+675 7567 8901',
    business: {
      name: 'PNG Pure Honey',
      type: 'informal' as const,
      sectors: ['agriculture'],
      description: 'Wild honey from pristine PNG forests',
      province: 'Morobe',
      district: 'Lae',
      cityVillage: 'Lae City',
      address: 'Market Road',
      phone: '+675 7567 8901',
    },
    products: [
      {
        name: 'Wild Forest Honey',
        description: 'Pure wild honey collected from PNG rainforests. Rich and natural.',
        categorySlug: 'processed-foods',
        price: 35.00,
        stockQty: 25,
        unit: 'jar',
      },
      {
        name: 'Beeswax Candles',
        description: 'Natural beeswax candles, handmade',
        categorySlug: 'household-goods',
        price: 20.00,
        stockQty: 30,
        unit: 'piece',
      },
    ],
  },
];

async function seedData() {
  log('\n🌱 Starting Data Seeding Process...\n', 'cyan');

  let sellersCreated = 0;
  let businessesCreated = 0;
  let productsCreated = 0;

  // Get categories for mapping
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug');

  const categoryMap = new Map(categories?.map(c => [c.slug, c.id]) || []);

  for (const sellerData of sampleSellers) {
    try {
      log(`\n📦 Creating seller: ${sellerData.fullName}...`, 'yellow');

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: sellerData.email,
        password: sellerData.password,
        options: {
          data: {
            full_name: sellerData.fullName,
          },
        },
      });

      if (authError) {
        // User might already exist, try to get existing user
        log(`   ⚠️  User may already exist: ${sellerData.email}`, 'yellow');

        // Sign in to get user ID
        const { data: signInData } = await supabase.auth.signInWithPassword({
          email: sellerData.email,
          password: sellerData.password,
        });

        if (!signInData.user) {
          log(`   ❌ Could not create/find user: ${sellerData.email}`, 'red');
          continue;
        }

        authData.user = signInData.user;
      }

      if (!authData.user) {
        log(`   ❌ Failed to create user`, 'red');
        continue;
      }

      sellersCreated++;

      // 2. Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: authData.user.id,
          email: sellerData.email,
          phone: sellerData.phone,
          full_name: sellerData.fullName,
          role: 'seller',
          status: 'active',
        });

      if (profileError) {
        log(`   ⚠️  Profile may already exist`, 'yellow');
      }

      log(`   ✅ User created: ${sellerData.email}`, 'green');

      // 3. Create business
      const slug = sellerData.business.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert({
          owner_user_id: authData.user.id,
          name: sellerData.business.name,
          slug: slug,
          type: sellerData.business.type,
          sector: sellerData.business.sectors,
          description: sellerData.business.description,
          province: sellerData.business.province,
          district: sellerData.business.district,
          city_village: sellerData.business.cityVillage,
          address: sellerData.business.address,
          phone: sellerData.business.phone,
          email: sellerData.email,
          tin: sellerData.business.tin || null,
          registration_no: sellerData.business.registrationNo || null,
          status: 'approved', // Auto-approve for testing
          verified: true,
        })
        .select()
        .single();

      if (businessError) {
        log(`   ❌ Business creation failed: ${businessError.message}`, 'red');
        continue;
      }

      businessesCreated++;
      log(`   ✅ Business created: ${sellerData.business.name}`, 'green');

      // 4. Create products
      for (const productData of sellerData.products) {
        const productSlug = productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const categoryId = categoryMap.get(productData.categorySlug);

        const { data: product, error: productError } = await supabase
          .from('products')
          .insert({
            business_id: business.id,
            category_id: categoryId,
            name: productData.name,
            slug: productSlug,
            description: productData.description,
            price: productData.price,
            compare_at_price: productData.compareAtPrice || null,
            stock_qty: productData.stockQty,
            unit: productData.unit,
            type: 'product',
            active: true,
            featured: productData.featured || false,
          })
          .select()
          .single();

        if (productError) {
          log(`      ❌ Product failed: ${productData.name}`, 'red');
          continue;
        }

        productsCreated++;
        log(`      ✅ Product: ${productData.name}`, 'green');
      }

      log(`   ✨ Completed: ${sellerData.business.name}`, 'magenta');

    } catch (error) {
      log(`   ❌ Error processing ${sellerData.fullName}: ${error}`, 'red');
    }
  }

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 Seeding Summary:', 'cyan');
  log(`   ✅ Sellers Created: ${sellersCreated}`, 'green');
  log(`   ✅ Businesses Created: ${businessesCreated}`, 'green');
  log(`   ✅ Products Created: ${productsCreated}`, 'green');
  log('='.repeat(60), 'cyan');

  if (sellersCreated > 0) {
    log('\n🎉 Data seeding completed successfully!\n', 'green');
    log('Test Credentials:', 'yellow');
    log('  Email: highland.fresh@test.com', 'blue');
    log('  Password: test123', 'blue');
    log('\nView products at: http://localhost:3001/marketplace', 'cyan');
  } else {
    log('\n⚠️  No data was created. Check for errors above.', 'yellow');
  }
}

// Run the seed function
seedData().catch(error => {
  log(`\n❌ Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'red');
  process.exit(1);
});
