# 🧪 Feature Testing Checklist

Use this checklist to test all features of PNG SME Marketplace.

---

## 🎯 Setup Prerequisites

- [ ] Database schema created (18 tables)
- [ ] Storage buckets created (3 buckets)
- [ ] Dev server running
- [ ] At least 1 test product added

---

## 👤 User Authentication

### Registration
- [ ] Can register new buyer account
- [ ] Can register new seller account
- [ ] Email validation works
- [ ] Password requirements enforced (6+ chars)
- [ ] Phone number accepts PNG format
- [ ] Success message displays
- [ ] Redirects to homepage

### Login
- [ ] Can login with email/password
- [ ] Wrong password shows error
- [ ] Redirects based on role (buyer → home, seller → dashboard)
- [ ] Remember session (refresh page stays logged in)
- [ ] Demo account works (admin@pngsme.com / demo123)

### Profile
- [ ] Profile page shows user info
- [ ] Shows correct role badge
- [ ] Can logout
- [ ] Logout redirects to homepage

---

## 🏪 Seller: Business Registration

### Business Setup Wizard
- [ ] Step 1: Business info form works
- [ ] Can select multiple sectors
- [ ] Progress bar updates
- [ ] Step 2: Location dropdowns work
- [ ] All 22 provinces available
- [ ] Step 3: Legal info (optional for informal)
- [ ] Step 4: Banking info (optional)
- [ ] Can navigate back/forward
- [ ] Submit creates business
- [ ] Success message displays

### Business Status
- [ ] New business status = "pending"
- [ ] Can manually approve in Supabase
- [ ] Approved business shows in seller dashboard

---

## 📦 Seller: Product Management

### Add Product
- [ ] Product creation form loads
- [ ] All fields editable
- [ ] Category dropdown shows 11 categories
- [ ] Type selector (Product/Service)
- [ ] Price accepts decimals
- [ ] Stock quantity accepts integers
- [ ] Unit dropdown has all units
- [ ] Description textarea works
- [ ] Active checkbox works
- [ ] Can submit without images
- [ ] Success redirects to products list

### Image Upload
- [ ] Can select multiple files (up to 5)
- [ ] Image preview displays
- [ ] Can remove images before upload
- [ ] First image marked as primary
- [ ] Upload completes successfully
- [ ] Images display in product list

### Product List
- [ ] Shows all seller's products
- [ ] Displays product images
- [ ] Shows prices correctly
- [ ] Stock count displays
- [ ] Active/inactive badges show
- [ ] Out of stock badge appears
- [ ] Featured badge displays
- [ ] Edit button works
- [ ] Delete button works (if implemented)

---

## 🛒 Buyer: Marketplace

### Browse Products
- [ ] Marketplace page loads
- [ ] Products display in grid
- [ ] Product cards show all info
- [ ] Images display correctly
- [ ] Prices formatted properly (K15.00)
- [ ] Ratings show (stars + count)
- [ ] Seller name displays
- [ ] Province/location shows
- [ ] "Add to Cart" button works

### Search & Filter
- [ ] Search bar accepts input
- [ ] Search returns results
- [ ] Category filter works
- [ ] Province filter works
- [ ] Filters can be cleared
- [ ] "No results" message shows
- [ ] Active filters display as badges
- [ ] Filter combinations work

### Product Detail Page
- [ ] Click product opens detail page
- [ ] Image gallery displays
- [ ] Can navigate between images
- [ ] Image thumbnails work
- [ ] Primary image highlighted
- [ ] Image counter shows (1 of 5)
- [ ] Product info displays
- [ ] Seller card shows info
- [ ] Verified badge appears
- [ ] Quantity selector works
- [ ] Add to cart works
- [ ] Breadcrumbs/navigation works

---

## 🛍️ Shopping Cart

### Cart Functionality
- [ ] Add to cart updates header count
- [ ] Cart icon shows badge
- [ ] Click cart opens cart page
- [ ] All items display
- [ ] Quantities show correctly
- [ ] Prices calculate correctly
- [ ] Can increase quantity (+)
- [ ] Can decrease quantity (-)
- [ ] Can type quantity directly
- [ ] Can remove items
- [ ] Subtotal calculates
- [ ] Delivery fee shows
- [ ] Total amount correct
- [ ] Empty cart message shows
- [ ] "Continue Shopping" button works

### Cart Persistence
- [ ] Cart survives page refresh
- [ ] Cart persists after logout/login
- [ ] Cart clears after checkout

---

## 💳 Checkout

### Checkout Form
- [ ] Checkout page loads
- [ ] Order summary shows
- [ ] All cart items listed
- [ ] Delivery method selector works
- [ ] Payment method selector works
- [ ] Delivery address required
- [ ] Province dropdown works
- [ ] Phone number required
- [ ] Delivery notes optional
- [ ] Total amount displays

### Order Creation
- [ ] Can complete checkout
- [ ] Order number generated
- [ ] Success message displays
- [ ] Redirects to orders page
- [ ] Cart clears after order
- [ ] Orders split by seller (if multiple sellers)

---

## 📋 Order Management

### Buyer: Order History
- [ ] Orders page loads
- [ ] All orders display
- [ ] Order number shows
- [ ] Order date formatted
- [ ] Status badge displays
- [ ] Payment status shows
- [ ] Items listed
- [ ] Seller info displays
- [ ] Delivery address shows
- [ ] Total amount correct
- [ ] Can view order details

### Seller: Order Dashboard
- [ ] Seller orders page loads
- [ ] Statistics cards display
  - [ ] Pending count
  - [ ] Active count
  - [ ] Completed count
  - [ ] Total revenue
- [ ] Order list displays
- [ ] Customer info shows
- [ ] Items breakdown visible
- [ ] Status buttons appear
- [ ] Can update order status
- [ ] Status progression works:
  - [ ] pending → confirmed
  - [ ] confirmed → packed
  - [ ] packed → out_for_delivery
  - [ ] out_for_delivery → delivered

---

## ⭐ Reviews & Ratings

### Submit Review
- [ ] Review form appears on product page
- [ ] Star rating selector works
- [ ] Comment textarea accepts text
- [ ] Requires purchase to review
- [ ] Submit button works
- [ ] Success message displays
- [ ] Review goes to "pending" status

### Display Reviews
- [ ] Approved reviews display
- [ ] Star rating shows
- [ ] Reviewer name displays
- [ ] Verified purchase badge shows
- [ ] Comment text displays
- [ ] Review date formatted
- [ ] Average rating calculates
- [ ] Review count displays

---

## 📊 Seller Dashboard

### Dashboard Stats
- [ ] Total products count
- [ ] Total orders count
- [ ] Total sales amount
- [ ] Product views count
- [ ] Stats update in real-time

### Quick Actions
- [ ] Links to all sections work
- [ ] "Add Product" shortcut works
- [ ] Navigation is intuitive

---

## 🔐 Admin Features

### Admin Dashboard
- [ ] Admin can access dashboard
- [ ] System stats display
- [ ] User count shows
- [ ] Business count shows
- [ ] Product count shows
- [ ] Revenue shows

### Business Approval
- [ ] Can view pending businesses
- [ ] Can approve businesses
- [ ] Can reject businesses
- [ ] Status updates work

---

## 🎨 UI/UX

### Design
- [ ] Logo displays everywhere
- [ ] Colors match PNG theme
- [ ] Typography is readable
- [ ] Buttons have hover states
- [ ] Cards have shadows
- [ ] Badges styled correctly
- [ ] Icons render properly

### Responsive Design
- [ ] Mobile view (< 640px)
- [ ] Tablet view (640-1024px)
- [ ] Desktop view (> 1024px)
- [ ] Navigation adapts
- [ ] Product grid adjusts
- [ ] Forms stack properly
- [ ] Images scale correctly

### Loading States
- [ ] Skeleton loaders show
- [ ] Button disabled states work
- [ ] "Loading..." text displays
- [ ] Spinners animate

### Error Handling
- [ ] Form validation errors show
- [ ] Network errors display
- [ ] 404 page exists
- [ ] Error messages are clear
- [ ] Can recover from errors

---

## 🔍 Search & Navigation

### Header Navigation
- [ ] Logo links to home
- [ ] Marketplace link works
- [ ] Categories link works
- [ ] Sellers link works
- [ ] Search bar functional
- [ ] User menu works
- [ ] Cart icon badge updates
- [ ] Wishlist icon works
- [ ] Mobile menu works

### Footer
- [ ] All links present
- [ ] Social icons display
- [ ] Contact info shows
- [ ] Copyright year correct
- [ ] Terms/Privacy links work

---

## 🔒 Security

### Authentication
- [ ] Protected routes redirect to login
- [ ] Seller routes check role
- [ ] Admin routes check role
- [ ] Can't access other users' data
- [ ] CSRF protection works
- [ ] Session timeout works

### Data Privacy
- [ ] RLS policies enforce access
- [ ] Users see only their orders
- [ ] Sellers see only their products
- [ ] Personal data protected

---

## 📱 Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 🐛 Common Issues to Test

### Image Upload
- [ ] Large files (> 5MB) rejected
- [ ] Wrong formats rejected
- [ ] Upload progress shows
- [ ] Upload failures handled

### Forms
- [ ] Required fields enforced
- [ ] Email format validated
- [ ] Phone format validated
- [ ] Number inputs accept decimals
- [ ] Text limits enforced

### Edge Cases
- [ ] Empty cart checkout blocked
- [ ] Out of stock products
- [ ] Deleted products in cart
- [ ] Concurrent orders
- [ ] Network offline
- [ ] Slow connection

---

## ✅ Final Checklist

Before deployment:

- [ ] All core features tested
- [ ] No console errors
- [ ] No linter errors
- [ ] Images load correctly
- [ ] Database connected
- [ ] Storage working
- [ ] All links functional
- [ ] Mobile tested
- [ ] Performance acceptable
- [ ] SEO basics done

---

## 📊 Testing Score

Count your checks:
- **90-100%**: 🎉 Production ready!
- **75-89%**: ⚠️ Minor fixes needed
- **50-74%**: 🔧 Several issues to resolve
- **< 50%**: ❌ Major work required

---

**Test systematically. Mark each item as you verify it works!**
