# 🎯 Simple Test Data Setup (5 Minutes)

## Step-by-Step: Add Your First Products

### ✅ Prerequisites
- [ ] Database running (tables created)
- [ ] Storage buckets created
- [ ] Dev server running (`bun run dev`)

---

## 🚀 STEP 1: Create Seller Account (1 min)

1. **Open**: http://localhost:3001/register

2. **Fill in**:
   ```
   Full Name: John Seller
   Email: seller@test.com
   Phone: +675 7123 4567
   Password: test123
   Confirm Password: test123
   ```

3. **Click**: "Create Account"

4. **Result**: ✅ Account created, redirected to home

---

## 🏪 STEP 2: Register Business (2 mins)

1. **Open**: http://localhost:3001/seller/register

2. **Step 1 - Business Info**:
   ```
   Business Name: Highland Fresh Produce
   Business Type: Informal
   Sectors: Click "Agriculture & Fresh Produce" 🌾
   Description: Fresh vegetables from Eastern Highlands
   ```
   Click "Next"

3. **Step 2 - Location**:
   ```
   Province: Eastern Highlands
   District: Goroka
   City/Village: Goroka Town
   Address: Main Market, Section 4
   Phone: +675 7123 4567
   Email: (leave blank or use seller@test.com)
   ```
   Click "Next"

4. **Step 3 - Legal Info**:
   - Just click "Next" (optional for informal)

5. **Step 4 - Banking**:
   - Just click "Submit Registration"

6. **Result**: ✅ Business registered!

---

## 📦 STEP 3: Add First Product (2 mins)

1. **Open**: http://localhost:3001/seller/products/new

2. **Fill in**:
   ```
   Product Name: Fresh Kaukau (Sweet Potato)

   Description:
   Premium quality kaukau from the Eastern Highlands.
   Rich in nutrients, perfect for traditional meals.
   Freshly harvested daily.

   Category: Fresh Produce
   Type: Product
   Price: 15.00
   Stock Quantity: 100
   Unit: kg
   ```

3. **Images** (Optional):
   - Skip for now OR
   - Download image from: https://unsplash.com/s/photos/sweet-potato
   - Click "Choose Files" and upload

4. **Check**: ✅ "Make product active"

5. **Click**: "Create Product"

6. **Result**: ✅ Product created!

---

## 🎉 VERIFY IT WORKS!

### Check Marketplace
**Open**: http://localhost:3001/marketplace

You should see:
- ✅ Your product "Fresh Kaukau" displayed
- ✅ Price: K15.00
- ✅ "Add to Cart" button

### Test Shopping Flow
1. Click "Add to Cart"
2. See cart count in header (1)
3. Click cart icon
4. See your product in cart
5. Click "Proceed to Checkout"

---

## 📝 Add More Products (Optional)

Copy these for quick entry:

### Product 2: Traditional Bilum
```
Name: Traditional Bilum - Handwoven
Category: Handicrafts
Type: Product
Price: 85.00
Stock: 15
Unit: piece
Description: Authentic handwoven bilum bag from Sepik region
```

### Product 3: Coffee Beans
```
Name: Organic Coffee Beans
Category: Cash Crops
Type: Product
Price: 45.00
Stock: 50
Unit: kg
Description: Premium Arabica beans from PNG highlands
```

### Product 4: Coconut Oil
```
Name: Fresh Coconut Oil
Category: Processed Foods
Type: Product
Price: 25.00
Stock: 30
Unit: litre
Description: 100% pure cold-pressed coconut oil
```

---

## 🎨 Adding Images (Optional)

### Free Image Sources:
1. **Unsplash** (no account needed):
   - Sweet Potato: https://unsplash.com/s/photos/sweet-potato
   - Coffee: https://unsplash.com/s/photos/coffee-beans
   - Handicrafts: https://unsplash.com/s/photos/woven-bag
   - Coconut Oil: https://unsplash.com/s/photos/coconut-oil

2. **How to use**:
   - Open link
   - Click on any image
   - Click "Download free"
   - Upload to product

### Image Requirements:
- Format: JPG, PNG, WEBP
- Size: Max 5MB
- Recommended: 800×800px or larger

---

## 🔧 If Business Needs Approval

Your business might be "Pending" status. To approve:

1. Open Supabase Dashboard:
   https://supabase.com/dashboard/project/ksyygnnyhdzficipkgqi

2. Go to: Table Editor → `businesses`

3. Find your business

4. Edit the row:
   - Change `status` to: `approved`
   - Click Save

5. Refresh marketplace

---

## ✅ Success Checklist

After completing all steps:

- [ ] Created seller account
- [ ] Registered business
- [ ] Added at least 1 product
- [ ] Product shows in marketplace
- [ ] Can add to cart
- [ ] Can view cart

---

## 🎯 What You Can Test Now

### Buyer Features:
1. Browse marketplace
2. Search products
3. Filter by category
4. Add to cart
5. Update quantities
6. Complete checkout
7. View order history

### Seller Features:
1. View products list
2. Add new products
3. Edit products
4. View orders (when someone buys)
5. Update order status
6. View dashboard stats

---

## 📞 Quick Reference Links

**For Sellers**:
- Dashboard: http://localhost:3001/seller/dashboard
- Products: http://localhost:3001/seller/products
- Add Product: http://localhost:3001/seller/products/new
- Orders: http://localhost:3001/seller/orders

**For Buyers**:
- Marketplace: http://localhost:3001/marketplace
- Cart: http://localhost:3001/cart
- Orders: http://localhost:3001/orders

**Authentication**:
- Login: http://localhost:3001/login
- Register: http://localhost:3001/register

---

## 🆘 Troubleshooting

### Can't upload images?
→ Run `.same/supabase-storage-setup.sql` in Supabase

### Product not showing?
→ Check "active" is checked when creating
→ Check business status is "approved"

### Business pending?
→ Manually approve in Supabase (see above)

---

**Total Time**: ~5 minutes
**Next**: Add more products or test the shopping flow!
