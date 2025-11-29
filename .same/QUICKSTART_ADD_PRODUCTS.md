# 🚀 Quick Start: Add Test Products

## ⚡ Fastest Way (2 Minutes)

### Automated Seeding (Recommended)

Run this one command to create everything:

```bash
bun run seed:data
```

**This creates**:
- ✅ 5 seller accounts
- ✅ 5 businesses (auto-approved)
- ✅ 15+ products across all categories
- ✅ Featured products
- ✅ Various price ranges and stock levels

**Test Credentials After Seeding**:
```
Seller 1 (Highland Fresh):
  Email: highland.fresh@test.com
  Password: test123

Seller 2 (Sepik Crafts):
  Email: sepik.crafts@test.com
  Password: test123

Seller 3 (Mountain Coffee):
  Email: mountain.coffee@test.com
  Password: test123
```

---

## 🎯 Manual Way (15 Minutes)

### Step 1: Create Seller Account

```
URL: http://localhost:3001/register

Name: Test Seller
Email: seller@test.com
Phone: +675 7123 4567
Password: test123
```

### Step 2: Register Business

```
URL: http://localhost:3001/seller/register

Business Name: My Test Shop
Province: Eastern Highlands
Address: Main Market
Phone: +675 7123 4567
```

### Step 3: Add Product

```
URL: http://localhost:3001/seller/products/new

Name: Fresh Kaukau
Category: Fresh Produce
Price: 15.00
Stock: 100
Unit: kg
```

---

## ✅ Verify Everything Works

### 1. Check Marketplace
```
http://localhost:3001/marketplace
```
Should show all products

### 2. Test Search
Search for "kaukau" or "coffee"

### 3. Test Add to Cart
Click "Add to Cart" on any product

### 4. Test Checkout
Go through the complete checkout flow

### 5. Seller Dashboard
```
http://localhost:3001/seller/products
```
Should show your products

---

## 🖼️ Adding Product Images

### Option 1: Upload During Product Creation
1. Go to "Add Product" page
2. Click "Choose Files" or drag images
3. Upload 1-5 images (max 5MB each)

### Option 2: Use Unsplash
Free high-quality images:
- Sweet Potato: https://unsplash.com/s/photos/sweet-potato
- Coffee: https://unsplash.com/s/photos/coffee-beans
- Handicrafts: https://unsplash.com/s/photos/handwoven

Download → Upload to product

### Option 3: Placeholder Images
Products without images will show a PNG logo placeholder

---

## 📊 Sample Product Data

Copy and paste these when adding products manually:

### Product 1: Fresh Kaukau
```
Name: Fresh Kaukau (Sweet Potato)
Category: Fresh Produce
Description: Premium quality kaukau from the highlands
Price: 15.00
Stock: 100
Unit: kg
```

### Product 2: Traditional Bilum
```
Name: Traditional Bilum - Handwoven
Category: Handicrafts
Description: Authentic handwoven bilum bag
Price: 85.00
Stock: 15
Unit: piece
```

### Product 3: Coffee Beans
```
Name: Organic Coffee Beans
Category: Cash Crops
Description: Premium Arabica beans from highlands
Price: 45.00
Stock: 50
Unit: kg
```

---

## 🎨 Product Categories Available

- ✅ Fresh Produce
- ✅ Livestock & Meat
- ✅ Cash Crops
- ✅ Handicrafts
- ✅ Art & Clothing
- ✅ Processed Foods
- ✅ Household Goods
- ✅ Personal Care
- ✅ Professional Services
- ✅ Trades & Construction
- ✅ Transport & Delivery

---

## 🐛 Troubleshooting

### "Storage bucket does not exist"
```bash
# Run storage setup SQL in Supabase
# File: .same/supabase-storage-setup.sql
```

### "Business not approved"
Go to Supabase Dashboard → businesses table → Change status to "approved"

### Products not showing
Check: Product "active" = true, Business "status" = approved

---

## 🎯 Next Steps

After adding products:

1. **Browse Marketplace** → See your products
2. **Test Shopping Cart** → Add items and checkout
3. **Create Test Order** → Complete purchase flow
4. **Process Order** → Update status in seller dashboard
5. **Leave Review** → Test review system

---

## 📞 Quick Links

- **Marketplace**: http://localhost:3001/marketplace
- **Add Product**: http://localhost:3001/seller/products/new
- **Register Seller**: http://localhost:3001/register
- **Seller Dashboard**: http://localhost:3001/seller/dashboard

---

**Choose Your Path**:
- ⚡ Fast → Run `bun run seed:data`
- 🎯 Manual → Follow Step 1-3 above
- 📚 Detailed → See `.same/ADD_TEST_PRODUCTS_GUIDE.md`
