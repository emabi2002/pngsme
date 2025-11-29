# Quick Setup Checklist - Supabase Database & Storage

## ⚡ Fast Setup (5 Minutes)

Follow these exact steps to set up your database:

---

### 1️⃣ Open Supabase SQL Editor

**Direct Link**: https://supabase.com/dashboard/project/ksyygnnyhdzficipkgqi/sql

Or navigate:
1. Go to https://supabase.com/dashboard
2. Select project: `ksyygnnyhdzficipkgqi`
3. Click **"SQL Editor"** in left sidebar

---

### 2️⃣ Run Main Database Schema

**File**: `.same/supabase-schema.sql`

1. Click **"New Query"** button
2. Open `.same/supabase-schema.sql` file
3. **Copy all content** (Ctrl/Cmd + A, then Ctrl/Cmd + C)
4. **Paste into SQL Editor**
5. Click **"Run"** or press Ctrl/Cmd + Enter
6. Wait 15-30 seconds

**Expected Output**:
```
Success. No rows returned
```

**What This Creates**:
- ✅ 18 database tables
- ✅ All indexes
- ✅ Row Level Security policies
- ✅ 11 product categories
- ✅ Helper functions

---

### 3️⃣ Set Up Storage Buckets

**File**: `.same/supabase-storage-setup.sql`

1. Click **"New Query"** button again
2. Open `.same/supabase-storage-setup.sql` file
3. **Copy all content**
4. **Paste into SQL Editor**
5. Click **"Run"**

**Expected Output**:
```
Success. No rows returned
```

**What This Creates**:
- ✅ product-images bucket (5MB limit)
- ✅ business-logos bucket (2MB limit)
- ✅ business-covers bucket (5MB limit)
- ✅ Storage access policies

---

### 4️⃣ Verify Setup

#### Option A: Run Test Script (Recommended)

```bash
# In your terminal
cd png-sme-marketplace
bun run test:db
```

**Expected Output**:
```
✅ Passed: 5
❌ Failed: 0
🎉 All tests passed! Your Supabase database is ready!
```

#### Option B: Manual Verification

1. **Check Tables**
   - Go to: https://supabase.com/dashboard/project/ksyygnnyhdzficipkgqi/editor
   - You should see 18 tables listed

2. **Check Categories**
   - Click on `categories` table
   - Should show 11 rows:
     - Fresh Produce, Livestock & Meat, Cash Crops, Handicrafts,
       Art & Clothing, Processed Foods, Household Goods,
       Personal Care, Professional Services, Trades & Construction,
       Transport & Delivery

3. **Check Storage**
   - Go to: https://supabase.com/dashboard/project/ksyygnnyhdzficipkgqi/storage/buckets
   - You should see 3 buckets listed

---

### 5️⃣ Test Application Connection

```bash
# Restart dev server
# Press Ctrl+C to stop current server
bun run dev
```

Open browser:
- Homepage: http://localhost:3001
- Marketplace: http://localhost:3001/marketplace
- Register: http://localhost:3001/register

**If you see pages load without errors, setup is successful!** ✅

---

## 🎯 Quick Test - Create Sample Data

### Create Test Seller Account

1. **Register**:
   - URL: http://localhost:3001/register
   - Name: Test Seller
   - Email: seller@test.com
   - Password: test123
   - Phone: +675 7123 4567

2. **Register Business**:
   - URL: http://localhost:3001/seller/register
   - Business Name: Highland Fresh Produce
   - Type: Informal
   - Sector: Agriculture & Fresh Produce
   - Province: Eastern Highlands
   - Address: Market Section 4
   - Phone: +675 7123 4567

3. **Add Product**:
   - URL: http://localhost:3001/seller/products/new
   - Name: Fresh Kaukau (Sweet Potato)
   - Category: Fresh Produce
   - Price: 15.00
   - Stock: 50
   - Unit: kg
   - Upload 1-2 images (optional)

4. **View in Marketplace**:
   - URL: http://localhost:3001/marketplace
   - Your product should appear!

---

## ❌ Troubleshooting

### "relation does not exist"
→ Run `.same/supabase-schema.sql` again

### "Storage bucket not found"
→ Run `.same/supabase-storage-setup.sql` again

### Test script fails
→ Check .env.local has correct Supabase credentials

### Can't upload images
→ Make sure storage buckets are created

### Application won't connect
→ Restart dev server with `bun run dev`

---

## ✅ Completion Checklist

Mark these as you complete each step:

- [ ] Opened Supabase SQL Editor
- [ ] Ran supabase-schema.sql successfully
- [ ] Ran supabase-storage-setup.sql successfully
- [ ] Ran `bun run test:db` - all tests passed
- [ ] Restarted dev server
- [ ] Homepage loads without errors
- [ ] Created test seller account
- [ ] Registered test business
- [ ] Added test product
- [ ] Product appears in marketplace

---

## 🎉 You're Done!

Once all checkboxes are marked, your PNG SME Marketplace is fully set up and ready to use!

**Next Steps**: See `.same/FEATURES_COMPLETED.md` for available features and how to use them.

---

**Need Detailed Instructions?** See `.same/SUPABASE_SETUP_GUIDE.md`

**Project ID**: ksyygnnyhdzficipkgqi
**Dashboard**: https://supabase.com/dashboard/project/ksyygnnyhdzficipkgqi
