# PNG SME Marketplace - Supabase Setup Instructions

## ✅ Step 1: Environment Variables (COMPLETED)

The `.env.local` file has been created with your Supabase credentials:
- ✓ NEXT_PUBLIC_SUPABASE_URL
- ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY

## 📋 Step 2: Create Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/ksyygnnyhdzficipkgqi

2. Navigate to **SQL Editor** in the left sidebar

3. Click **New Query**

4. Copy the entire contents of `.same/supabase-schema.sql`

5. Paste it into the SQL Editor

6. Click **Run** or press `Ctrl/Cmd + Enter`

7. Wait for the schema to be created (should take 10-30 seconds)

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't
brew install supabase/tap/supabase  # macOS
# or
npm install -g supabase             # npm

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref ksyygnnyhdzficipkgqi

# Run the migration
supabase db push
```

## 🗄️ What Gets Created

The schema creates:

### **Tables** (18 total):
- `users` - User profiles and authentication
- `businesses` - SME/MSME business profiles
- `categories` - Product and service categories
- `products` - Product listings
- `product_images` - Product photos
- `product_variants` - Product variations (size, color, etc.)
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `reviews` - Product and business reviews
- `memberships` - SME Council membership records
- `delivery_providers` - Logistics partners
- `deliveries` - Delivery tracking
- `wallets` - Digital wallets for sellers
- `wallet_transactions` - Transaction history
- `payout_requests` - Withdrawal requests
- `training_modules` - Business training content
- `support_tickets` - Customer support tickets
- `announcements` - Platform announcements

### **Security Features**:
- ✓ Row Level Security (RLS) enabled on all tables
- ✓ Policies for buyers, sellers, and admins
- ✓ Secure authentication integration
- ✓ Public read access for marketplace data
- ✓ Private access for user-specific data

### **Indexes**:
- ✓ Optimized queries for search and filtering
- ✓ Full-text search on product names and descriptions
- ✓ Fast lookups by business, category, status, etc.

### **Seed Data**:
- ✓ 11 default product categories pre-populated

## 🔐 Step 3: Configure Authentication (Optional)

### Enable Email/Password Authentication

1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Enable **Email** provider
3. Configure email templates (optional):
   - Confirmation email
   - Password reset email
   - Magic link email

### Enable Social Login (Optional - Phase 2)

For future implementation:
- Google OAuth
- Facebook OAuth

## 📊 Step 4: Verify Setup

After running the schema, you can verify everything is set up correctly:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see all 18 tables listed
3. Click on `categories` table - you should see 11 pre-populated categories
4. Check that RLS is enabled (green shield icon)

## 🚀 Step 5: Test Connection

The app is already configured to connect to your Supabase instance. Once the schema is created:

1. Restart your dev server if it's running
2. The app will automatically connect to Supabase
3. You can start building features!

## 📝 Next Steps

After database setup is complete, you can:

1. **Create authentication pages** (login, signup, profile)
2. **Build marketplace search** (browse products)
3. **Implement seller registration** (onboard businesses)
4. **Add product management** (CRUD for sellers)
5. **Build order flow** (cart, checkout, order tracking)

## 🆘 Troubleshooting

### Error: "relation does not exist"
- Make sure the SQL schema ran successfully
- Check for any error messages in the SQL Editor
- Try running the schema again

### Error: "RLS policy violation"
- This is normal if you're not authenticated yet
- Public data (products, categories) should still be accessible
- User-specific data requires authentication

### Connection Issues
- Verify your `.env.local` credentials are correct
- Make sure you're using the correct Supabase URL and anon key
- Restart your Next.js dev server after changing `.env.local`

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Client API](https://supabase.com/docs/reference/javascript/introduction)
