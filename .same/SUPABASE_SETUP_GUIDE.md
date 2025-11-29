# Supabase Setup Guide - PNG SME Marketplace

## 📋 Overview

This guide will walk you through setting up your Supabase database and storage for the PNG SME Marketplace. The setup involves:

1. Running the main database schema
2. Setting up storage buckets
3. Verifying the setup
4. Testing the connection

**Estimated Time**: 10-15 minutes

---

## ✅ Prerequisites

Before you begin, ensure you have:

- [x] Supabase account created
- [x] Project created at: https://ksyygnnyhdzficipkgqi.supabase.co
- [x] Environment variables set in `.env.local`
- [ ] Access to Supabase SQL Editor

---

## 🗄️ Step 1: Run Main Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/ksyygnnyhdzficipkgqi

2. **Navigate to SQL Editor**
   - Click on **SQL Editor** in the left sidebar
   - Or go directly to: https://supabase.com/dashboard/project/ksyygnnyhdzficipkgqi/sql

3. **Create New Query**
   - Click the **"New Query"** button
   - Or click the **"+"** icon

4. **Copy the Schema**
   - Open the file: `.same/supabase-schema.sql`
   - Select all content (Cmd/Ctrl + A)
   - Copy it (Cmd/Ctrl + C)

5. **Paste and Execute**
   - Paste the entire content into the SQL Editor
   - Click **"Run"** button or press `Ctrl/Cmd + Enter`
   - Wait 15-30 seconds for execution

6. **Verify Success**
   - You should see: "Success. No rows returned"
   - Check for any error messages in red

### Expected Result:
```
✓ 18 tables created
✓ All indexes created
✓ RLS policies enabled
✓ 11 categories seeded
✓ Functions and triggers created
```

---

## 📦 Step 2: Set Up Storage Buckets

1. **Run Storage Setup SQL**
   - In the same SQL Editor, create a **New Query**
   - Open file: `.same/supabase-storage-setup.sql`
   - Copy all content
   - Paste and click **"Run"**

2. **Verify Buckets Created**
   - Go to **Storage** in the left sidebar
   - You should see 3 buckets:
     - ✓ `product-images` (5MB limit, public)
     - ✓ `business-logos` (2MB limit, public)
     - ✓ `business-covers` (5MB limit, public)

### Expected Result:
```
✓ 3 storage buckets created
✓ RLS policies for storage enabled
✓ Public read access configured
✓ Upload permissions set
```

---

## 🔍 Step 3: Verify Database Setup

### Check Tables

1. **Go to Table Editor**
   - Click **"Table Editor"** in left sidebar
   - Or go to: https://supabase.com/dashboard/project/ksyygnnyhdzficipkgqi/editor

2. **Verify All Tables Exist**
   - [ ] `users`
   - [ ] `businesses`
   - [ ] `categories` (should have 11 rows)
   - [ ] `products`
   - [ ] `product_images`
   - [ ] `product_variants`
   - [ ] `orders`
   - [ ] `order_items`
   - [ ] `reviews`
   - [ ] `memberships`
   - [ ] `delivery_providers`
   - [ ] `deliveries`
   - [ ] `wallets`
   - [ ] `wallet_transactions`
   - [ ] `payout_requests`
   - [ ] `training_modules`
   - [ ] `support_tickets`
   - [ ] `announcements`

3. **Check Categories Data**
   - Click on `categories` table
   - You should see 11 pre-populated categories:
     - Fresh Produce 🥬
     - Livestock & Meat 🐷
     - Cash Crops ☕
     - Handicrafts 🎨
     - Art & Clothing 👗
     - Processed Foods 🥜
     - Household Goods 🏠
     - Personal Care 🧴
     - Professional Services 💼
     - Trades & Construction 🔧
     - Transport & Delivery 🚗

### Check RLS Policies

1. **Verify RLS is Enabled**
   - In Table Editor, look for green shield icon 🛡️ next to each table
   - This means Row Level Security is active

2. **Test Public Access**
   - Click on `categories` table
   - You should be able to view all rows (public data)

---

## 🧪 Step 4: Test the Connection

### Test from the Application

1. **Restart Dev Server**
   ```bash
   # Stop the current dev server (Ctrl+C)
   # Then restart it
   cd png-sme-marketplace
   bun run dev
   ```

2. **Open the Application**
   - Go to: http://localhost:3001 (or 3000)
   - You should see the homepage load without errors

3. **Test Database Connection**
   - Go to: http://localhost:3001/marketplace
   - Initially, it will show "No products found" (expected)
   - This confirms the connection works

4. **Test Authentication**
   - Go to: http://localhost:3001/register
   - Try creating a test account
   - If successful, the database is connected!

### Run Quick Test Script

Create a test file to verify connection:

```typescript
// test-db-connection.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ksyygnnyhdzficipkgqi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  // Test 1: Fetch categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')

  if (error) {
    console.error('❌ Error fetching categories:', error)
  } else {
    console.log('✅ Categories fetched:', categories?.length, 'items')
  }
}

testConnection()
```

---

## 🎯 Step 5: Add Test Data (Optional)

To populate your marketplace with sample data:

### Create a Test Seller Account

1. **Register as a Seller**
   - Go to: http://localhost:3001/register
   - Create account: `seller@test.com` / `test123`

2. **Register Business**
   - Go to: http://localhost:3001/seller/register
   - Fill in business details:
     - Name: "Highland Fresh Produce"
     - Type: Informal
     - Sector: Agriculture
     - Province: Eastern Highlands
     - Phone: +675 7234 5678

3. **Add Products**
   - Go to: http://localhost:3001/seller/products/new
   - Add a test product:
     - Name: "Fresh Kaukau (Sweet Potato)"
     - Category: Fresh Produce
     - Price: 15.00
     - Stock: 50
     - Unit: kg

### Create Test Admin Account

You already have admin credentials from before:
- Email: `admin@pngsme.com`
- Password: `demo123`

**Note**: You'll need to manually update this user's role to 'admin' in Supabase:

1. Go to **Table Editor** > `users` table
2. Find the user with email `admin@pngsme.com`
3. Edit the row
4. Change `role` to `admin`
5. Save

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### ❌ "relation does not exist"
**Cause**: Schema not run successfully
**Solution**:
- Re-run `.same/supabase-schema.sql`
- Check for error messages in red
- Make sure you're in the correct project

#### ❌ "RLS policy violation"
**Cause**: Row Level Security blocking access
**Solution**:
- This is normal for private data (orders, user profiles)
- Public data (products, categories) should work
- Make sure you're authenticated for private data

#### ❌ "Storage bucket does not exist"
**Cause**: Storage setup not run
**Solution**:
- Run `.same/supabase-storage-setup.sql`
- Verify buckets in Storage section

#### ❌ "JWT expired" or "Invalid API key"
**Cause**: Wrong credentials in .env.local
**Solution**:
- Go to Supabase Dashboard > Settings > API
- Copy the correct `anon` key
- Update `.env.local`
- Restart dev server

#### ❌ Connection timeout
**Cause**: Network or Supabase service issue
**Solution**:
- Check internet connection
- Verify Supabase project is not paused
- Try again in a few minutes

---

## ✅ Setup Verification Checklist

Use this checklist to confirm everything is working:

### Database
- [ ] All 18 tables visible in Table Editor
- [ ] Categories table has 11 rows
- [ ] Green shield icon (RLS) on all tables
- [ ] Can view categories from application

### Storage
- [ ] 3 buckets created (product-images, business-logos, business-covers)
- [ ] Buckets are marked as public
- [ ] Storage policies visible

### Application
- [ ] Dev server starts without errors
- [ ] Homepage loads successfully
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Marketplace page loads (even if empty)

### Advanced (Optional)
- [ ] Created test seller account
- [ ] Registered test business
- [ ] Added test product
- [ ] Product appears in marketplace
- [ ] Can add product to cart
- [ ] Can complete checkout

---

## 📊 What Happens Next

Once the database and storage are set up:

1. **Users can register** - Authentication works
2. **Sellers can register businesses** - Pending approval
3. **Sellers can add products** - With image uploads
4. **Buyers can browse marketplace** - Filter and search
5. **Cart and checkout work** - Order creation
6. **Sellers can manage orders** - Order dashboard

---

## 🚀 Next Steps After Setup

1. **Create your first seller account**
2. **Add 5-10 test products** with images
3. **Test the complete buyer flow** (browse → cart → checkout)
4. **Test the seller flow** (add product → receive order → process)
5. **Customize categories** if needed

---

## 📞 Need Help?

If you encounter issues:

1. **Check the Console**
   - Browser console (F12) for frontend errors
   - Terminal for backend errors

2. **Check Supabase Logs**
   - Go to Supabase Dashboard > Logs
   - Check for authentication or database errors

3. **Verify Environment Variables**
   - Make sure `.env.local` has correct values
   - Restart dev server after changes

4. **Review Documentation**
   - `.same/SETUP_INSTRUCTIONS.md`
   - `.same/DATABASE_REFERENCE.md`
   - Supabase docs: https://supabase.com/docs

---

## 🎉 Success!

Once you see:
- ✅ Tables created
- ✅ Storage buckets ready
- ✅ Application connects successfully
- ✅ Can register and login

**You're ready to start using the PNG SME Marketplace!**

---

**Last Updated**: Version 5
**Supabase Project**: ksyygnnyhdzficipkgqi
