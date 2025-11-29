# Adding Test Products with Images - Step-by-Step Guide

## 🎯 Overview

This guide will help you populate your PNG SME Marketplace with sample products and images to test all features.

---

## 📋 Prerequisites

Before adding test products, ensure:
- [ ] Database schema is running (18 tables created)
- [ ] Storage buckets are created (run `.same/supabase-storage-setup.sql`)
- [ ] Dev server is running (`bun run dev`)

---

## 🚀 Method 1: Manual Entry (Recommended for Learning)

### Step 1: Create a Seller Account

1. **Go to**: http://localhost:3001/register
2. **Register with**:
   - Name: `John Seller`
   - Email: `seller1@test.com`
   - Phone: `+675 7123 4567`
   - Password: `test123`
3. Click **"Create Account"**

### Step 2: Register Your Business

1. **Go to**: http://localhost:3001/seller/register
2. **Fill in the 4-step wizard**:

   **Step 1: Business Information**
   - Business Name: `Highland Fresh Produce`
   - Business Type: `Informal`
   - Sectors: Select `Agriculture & Fresh Produce`
   - Description: `Fresh vegetables and root crops from Eastern Highlands`

   **Step 2: Location & Contact**
   - Province: `Eastern Highlands`
   - District: `Goroka`
   - City/Village: `Goroka Town`
   - Address: `Main Market, Section 4`
   - Phone: `+675 7123 4567`
   - Email: (optional)

   **Step 3: Legal Information** (Skip for informal)
   - Click "Next"

   **Step 4: Banking Details** (Optional)
   - Bank Name: `Bank South Pacific (BSP)`
   - Account Number: `1234567890`
   - Account Name: `Highland Fresh Produce`

3. Click **"Submit Registration"**

### Step 3: Add Your First Product

1. **Go to**: http://localhost:3001/seller/products/new

2. **Fill in Product Details**:
   - **Product Name**: `Fresh Kaukau (Sweet Potato)`
   - **Description**:
     ```
     Premium quality kaukau from the highlands.
     Rich in nutrients, perfect for traditional meals.
     Freshly harvested daily.
     ```
   - **Category**: `Fresh Produce`
   - **Type**: `Product`
   - **Price**: `15.00`
   - **Stock Quantity**: `100`
   - **Unit**: `kg`

3. **Add Images**:
   - Click "Click to upload" or drag images
   - Upload 1-3 images of kaukau/sweet potatoes
   - First image becomes primary

4. **Check**: ✅ Make product active

5. Click **"Create Product"**

### Step 4: Add More Products

Repeat Step 3 with different products:

#### Product 2: Traditional Bilum
- Name: `Traditional Bilum - Handwoven`
- Category: `Handicrafts`
- Price: `85.00`
- Stock: `15`
- Unit: `piece`
- Description: `Authentic handwoven bilum bag from Sepik region`

#### Product 3: Organic Coffee
- Name: `Organic Coffee Beans - PNG Highlands`
- Category: `Cash Crops`
- Price: `45.00`
- Stock: `50`
- Unit: `kg`
- Description: `Premium Arabica beans grown at 1500m altitude`

#### Product 4: Coconut Oil
- Name: `Fresh Coconut Oil - Cold Pressed`
- Category: `Processed Foods`
- Price: `25.00`
- Stock: `30`
- Unit: `litre`
- Description: `100% pure coconut oil, traditionally pressed`

---

## 🖼️ Where to Get Sample Images

### Free Image Sources

1. **Unsplash** (Free, high-quality):
   - https://unsplash.com/s/photos/sweet-potato
   - https://unsplash.com/s/photos/coffee-beans
   - https://unsplash.com/s/photos/coconut-oil
   - https://unsplash.com/s/photos/handwoven-bag

2. **Pexels** (Free stock photos):
   - https://www.pexels.com/search/vegetables/
   - https://www.pexels.com/search/agricultural-products/

3. **Pixabay** (Free images):
   - https://pixabay.com/images/search/fresh-produce/

### Using Your Own Images
- Take photos with your phone
- Recommended size: 800px × 800px minimum
- Format: JPG or PNG
- Keep files under 3MB each

---

## 🤖 Method 2: Quick Seed Script (Fast Setup)

### Create Multiple Sellers & Products Automatically

I can create a seed script that:
- Creates 3-5 seller accounts
- Registers their businesses
- Adds 10-20 sample products
- Uses placeholder images

**Would you like me to create this script?**

---

## 📊 Method 3: Import from CSV (Bulk Upload)

For bulk product imports:

1. Create a CSV file with product data
2. Use a script to import all at once
3. Automatically fetch images from URLs

**Sample CSV format**:
```csv
name,category,price,stock,unit,description,seller_email
Fresh Kaukau,Fresh Produce,15.00,100,kg,Premium highland sweet potato,seller1@test.com
Traditional Bilum,Handicrafts,85.00,15,piece,Handwoven Sepik bag,seller2@test.com
```

---

## ✅ Verification Checklist

After adding products, verify:

### Test Product Display
- [ ] Go to http://localhost:3001/marketplace
- [ ] Products appear in the grid
- [ ] Images display correctly
- [ ] Prices show properly
- [ ] Categories filter works

### Test Product Detail Page
- [ ] Click on a product
- [ ] Image gallery works
- [ ] Can navigate between images
- [ ] Product info displays
- [ ] Add to cart works

### Test Shopping Flow
- [ ] Add product to cart
- [ ] Cart count updates in header
- [ ] Go to cart page
- [ ] Proceed to checkout
- [ ] Complete order

### Test Seller Dashboard
- [ ] Go to http://localhost:3001/seller/products
- [ ] Your products are listed
- [ ] Can edit products
- [ ] Stats show correctly

---

## 🎨 Sample Product Ideas by Category

### Fresh Produce 🥬
- Fresh Kaukau (Sweet Potato)
- Taro
- Yams
- Fresh Greens (Aibika)
- Coconuts
- Bananas
- Pineapples

### Handicrafts 🎨
- Traditional Bilum
- Wood Carvings
- Pottery
- Woven Mats
- Traditional Masks

### Cash Crops ☕
- Coffee Beans
- Cocoa Beans
- Vanilla Beans
- Black Pepper
- Cardamom

### Processed Foods 🥜
- Coconut Oil
- Peanut Butter
- Dried Fish
- Smoked Meat
- Honey

### Household Goods 🏠
- Bamboo Baskets
- Cooking Utensils
- Traditional Pots
- Cleaning Supplies

---

## 🚨 Troubleshooting

### Images Won't Upload
**Error**: "Storage bucket does not exist"

**Solution**:
1. Run `.same/supabase-storage-setup.sql` in Supabase
2. Restart dev server
3. Try uploading again

### Product Not Appearing in Marketplace
**Check**:
- Is product marked as "Active"? ✅
- Is business status "Approved"? (Check in Supabase dashboard)
- Refresh the marketplace page

### Images Appear Broken
**Check**:
- File size under 5MB?
- File format is JPG/PNG/WEBP?
- Storage buckets created?
- Public read access enabled?

---

## 📈 Recommended Test Data Volume

For a realistic demo:
- **3-5 sellers** (different provinces)
- **15-25 products** total
- **3-5 products per category**
- **2-3 images per product**
- **Mix of product types** (products + services)

---

## 🎯 Next Steps After Adding Products

1. **Test Buyer Flow**:
   - Browse marketplace
   - Search products
   - Filter by category
   - Add to cart
   - Checkout

2. **Test Seller Flow**:
   - View orders (when someone buys)
   - Update order status
   - Manage inventory
   - View analytics

3. **Test Reviews** (need to complete purchase first):
   - Buy a product
   - Mark as delivered
   - Leave a review

---

## 💡 Pro Tips

1. **Use Realistic Data**: Makes testing more meaningful
2. **Vary Prices**: Test different price ranges (K5 - K500)
3. **Different Provinces**: Test location filtering
4. **Stock Levels**: Some high, some low, some out-of-stock
5. **Image Quality**: Use clear, well-lit product photos

---

## 🆘 Need Help?

**Having issues?**
1. Check browser console (F12) for errors
2. Run `bun run test:db` to verify database
3. Check Supabase logs for storage issues
4. Restart dev server

**Want automated setup?**
Let me know and I can create a seed script that adds all test data automatically!

---

**Ready to add your first product?** Go to:
👉 http://localhost:3001/seller/products/new

**Or create a seller account first at**:
👉 http://localhost:3001/register
