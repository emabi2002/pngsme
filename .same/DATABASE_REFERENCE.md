# Database Reference - PNG SME Marketplace

## 📚 Quick Reference

### Database Structure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PNG SME Marketplace DB                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  👤 USERS & AUTH          🏪 MARKETPLACE                     │
│  - users                  - businesses                       │
│  - memberships            - products                         │
│                           - product_images                   │
│                           - product_variants                 │
│  📦 ORDERS & SALES        - categories                       │
│  - orders                                                    │
│  - order_items            🚚 LOGISTICS                       │
│  - reviews                - delivery_providers               │
│                           - deliveries                       │
│  💰 FINANCE                                                  │
│  - wallets                📚 SUPPORT & TRAINING              │
│  - wallet_transactions    - training_modules                 │
│  - payout_requests        - support_tickets                  │
│                           - announcements                    │
└─────────────────────────────────────────────────────────────┘
```

## 🔑 Key Tables & Relationships

### 1. Users & Authentication

**users**
```typescript
{
  id: UUID              // Links to auth.users
  email: string
  phone: string
  full_name: string
  role: 'buyer' | 'seller' | 'logistics' | 'admin' | 'council_admin' | 'support'
  status: 'active' | 'suspended' | 'banned'
  verified_phone: boolean
  verified_email: boolean
}
```

**Relationships:**
- One user can own multiple businesses
- One user can have multiple orders (as buyer)
- One user can have one membership

### 2. Businesses

**businesses**
```typescript
{
  id: UUID
  owner_user_id: UUID   // -> users.id
  name: string
  slug: string          // Unique URL-friendly identifier
  type: 'formal' | 'informal'
  sector: string[]      // ['agriculture', 'handicrafts', ...]
  province: string      // One of 22 PNG provinces
  district: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  verified: boolean     // KYC verified
  rating_avg: decimal
  rating_count: integer
  total_sales: decimal
}
```

**Relationships:**
- One business has many products
- One business has many orders (as seller)
- One business has one wallet
- One business has one membership

### 3. Products

**products**
```typescript
{
  id: UUID
  business_id: UUID     // -> businesses.id
  category_id: UUID     // -> categories.id
  name: string
  slug: string
  price: decimal
  compare_at_price: decimal  // For discounts
  stock_qty: integer
  unit: string          // 'kg', 'piece', 'bunch', etc.
  type: 'product' | 'service'
  active: boolean
  featured: boolean
  rating_avg: decimal
  view_count: integer
  sale_count: integer
}
```

**Related Tables:**
- `product_images` - Multiple photos per product
- `product_variants` - Size, color variations

### 4. Orders

**orders**
```typescript
{
  id: UUID
  order_number: string  // e.g., "ORD-20250129-1234"
  buyer_user_id: UUID   // -> users.id
  seller_business_id: UUID  // -> businesses.id
  subtotal: decimal
  delivery_fee: decimal
  commission_amount: decimal
  total_amount: decimal
  status: 'pending_payment' | 'confirmed' | 'delivered' | ...
  payment_status: 'pending' | 'paid' | 'refunded'
  payment_method: 'cod' | 'bank_transfer' | 'wallet' | ...
  delivery_method: 'pickup' | 'seller_delivery' | 'logistics_partner'
}
```

**Order Flow:**
1. `pending_payment` - Order created, awaiting payment
2. `pending_confirmation` - Payment received, seller needs to confirm
3. `confirmed` - Seller accepted order
4. `packed` - Order is ready for delivery
5. `out_for_delivery` - In transit
6. `delivered` - Order complete
7. `cancelled` / `disputed` / `refunded` - Exception states

## 🔍 Common Queries

### Get All Products

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()

const { data: products } = await supabase
  .from('products')
  .select(`
    *,
    business:businesses(*),
    images:product_images(*)
  `)
  .eq('active', true)
  .order('created_at', { ascending: false })
```

### Get Products by Category

```typescript
const { data } = await supabase
  .from('products')
  .select('*, business:businesses(*), images:product_images(*)')
  .eq('category_id', categoryId)
  .eq('active', true)
```

### Get Products by Business

```typescript
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('business_id', businessId)
  .eq('active', true)
```

### Search Products

```typescript
const { data } = await supabase
  .from('products')
  .select('*, business:businesses(*)')
  .textSearch('name', searchQuery, {
    type: 'websearch',
    config: 'english'
  })
```

### Get User's Orders (as Buyer)

```typescript
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    items:order_items(*),
    seller:businesses(*)
  `)
  .eq('buyer_user_id', userId)
  .order('created_at', { ascending: false })
```

### Get Business Orders (as Seller)

```typescript
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    items:order_items(*),
    buyer:users(full_name, email, phone)
  `)
  .eq('seller_business_id', businessId)
  .order('created_at', { ascending: false })
```

## 🛡️ Row Level Security (RLS)

All tables have RLS enabled. Key policies:

### Public Data (No auth required)
- ✅ View approved businesses
- ✅ View active products
- ✅ View active categories
- ✅ View approved reviews
- ✅ View published training modules
- ✅ View published announcements

### Private Data (Auth required)
- 🔒 User profiles (own data only)
- 🔒 Orders (buyer or seller only)
- 🔒 Wallets (owner only)
- 🔒 Support tickets (creator only)
- 🔒 Business management (owner only)

## 📊 Helper Functions Available

### Products
```typescript
import { getProducts, getProductBySlug, getFeaturedProducts } from '@/lib/db/products'

// Get all products with filters
const products = await getProducts({
  limit: 12,
  offset: 0,
  category: 'category-id',
  search: 'query',
  featured: true
})

// Get single product
const product = await getProductBySlug('fresh-kaukau')

// Get featured products
const featured = await getFeaturedProducts(4)
```

### Categories
```typescript
import { getCategories, getCategoryBySlug, getTopLevelCategories } from '@/lib/db/categories'

const categories = await getCategories()
const category = await getCategoryBySlug('handicrafts')
const topLevel = await getTopLevelCategories()
```

### Businesses
```typescript
import { getBusinesses, getBusinessBySlug, getVerifiedBusinesses } from '@/lib/db/businesses'

const businesses = await getBusinesses({
  sector: 'agriculture',
  province: 'Eastern Highlands',
  verified: true
})

const business = await getBusinessBySlug('highland-fresh')
const verified = await getVerifiedBusinesses(10)
```

## 🔢 Database Statistics

After setup, you'll have:
- **18 tables** with comprehensive relationships
- **30+ indexes** for fast queries
- **25+ RLS policies** for security
- **11 seed categories** pre-populated
- **5 auto-generated number functions** (order, ticket, membership IDs)
- **Full-text search** enabled on products and businesses

## 📝 Next Steps

1. ✅ **Run the schema** in Supabase (see SETUP_INSTRUCTIONS.md)
2. 🔨 **Test queries** using Supabase SQL Editor
3. 🎨 **Build UI components** that fetch real data
4. 🔐 **Add authentication** flows
5. 📤 **Create data entry** forms for sellers

## 🆘 Need Help?

- Check `.same/SETUP_INSTRUCTIONS.md` for setup steps
- View `.same/database-schema.md` for detailed schema docs
- See `src/lib/db/` for example queries
- Supabase Docs: https://supabase.com/docs
