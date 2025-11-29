# Database Schema - PNG SME Marketplace

## Core Tables

### users
```sql
- id: uuid (primary key, auth.users reference)
- email: text
- phone: text (unique)
- full_name: text
- role: enum (buyer, seller, logistics, admin, council_admin, support)
- status: enum (active, suspended, banned)
- verified_phone: boolean
- verified_email: boolean
- created_at: timestamp
- updated_at: timestamp
```

### businesses
```sql
- id: uuid (primary key)
- owner_user_id: uuid (foreign key -> users)
- name: text
- slug: text (unique)
- type: enum (formal, informal)
- sector: text[] (agriculture, retail, handicrafts, services, etc.)
- description: text
- logo_url: text
- cover_image_url: text
- tin: text (Tax Identification Number)
- registration_no: text (IPA registration)
- province: text
- district: text
- city_village: text
- address: text
- lat: decimal
- lng: decimal
- phone: text
- email: text
- bank_name: text
- bank_account_no: text
- bank_account_name: text
- status: enum (pending, approved, rejected, suspended)
- verified: boolean
- rating_avg: decimal
- rating_count: integer
- total_sales: decimal
- created_at: timestamp
- updated_at: timestamp
```

### memberships
```sql
- id: uuid (primary key)
- business_id: uuid (foreign key -> businesses)
- user_id: uuid (foreign key -> users)
- membership_number: text (unique)
- tier: enum (standard, premium, gold)
- start_date: date
- end_date: date
- status: enum (active, expired, cancelled)
- fee_paid: decimal
- payment_reference: text
- created_at: timestamp
- updated_at: timestamp
```

### categories
```sql
- id: uuid (primary key)
- name: text
- slug: text (unique)
- description: text
- icon: text
- parent_id: uuid (self-reference for subcategories)
- display_order: integer
- active: boolean
- created_at: timestamp
```

### products
```sql
- id: uuid (primary key)
- business_id: uuid (foreign key -> businesses)
- category_id: uuid (foreign key -> categories)
- name: text
- slug: text
- description: text
- price: decimal
- compare_at_price: decimal (for discounts)
- stock_qty: integer
- unit: text (kg, piece, bunch, etc.)
- sku: text
- type: enum (product, service)
- active: boolean
- featured: boolean
- rating_avg: decimal
- rating_count: integer
- view_count: integer
- sale_count: integer
- created_at: timestamp
- updated_at: timestamp
```

### product_images
```sql
- id: uuid (primary key)
- product_id: uuid (foreign key -> products)
- file_url: text
- alt_text: text
- is_primary: boolean
- display_order: integer
- created_at: timestamp
```

### product_variants
```sql
- id: uuid (primary key)
- product_id: uuid (foreign key -> products)
- name: text (e.g., "Small", "Red", "1kg")
- price_adjustment: decimal
- stock_qty: integer
- sku: text
- active: boolean
```

### orders
```sql
- id: uuid (primary key)
- order_number: text (unique)
- buyer_user_id: uuid (foreign key -> users)
- seller_business_id: uuid (foreign key -> businesses)
- subtotal: decimal
- delivery_fee: decimal
- commission_amount: decimal
- total_amount: decimal
- status: enum (pending_payment, pending_confirmation, confirmed, packed, out_for_delivery, delivered, cancelled, disputed, refunded)
- payment_status: enum (pending, paid, refunded)
- payment_method: enum (cod, bank_transfer, wallet, mobile_money, card)
- payment_reference: text
- delivery_method: enum (pickup, seller_delivery, logistics_partner)
- delivery_address: text
- delivery_province: text
- delivery_district: text
- delivery_phone: text
- delivery_notes: text
- buyer_notes: text
- seller_notes: text
- cancelled_by: uuid (foreign key -> users)
- cancelled_reason: text
- confirmed_at: timestamp
- delivered_at: timestamp
- created_at: timestamp
- updated_at: timestamp
```

### order_items
```sql
- id: uuid (primary key)
- order_id: uuid (foreign key -> orders)
- product_id: uuid (foreign key -> products)
- product_variant_id: uuid (foreign key -> product_variants, nullable)
- quantity: integer
- unit_price: decimal
- total_price: decimal
- product_snapshot: jsonb (name, description, image for historical record)
```

### reviews
```sql
- id: uuid (primary key)
- order_id: uuid (foreign key -> orders)
- reviewer_user_id: uuid (foreign key -> users)
- target_business_id: uuid (foreign key -> businesses)
- target_product_id: uuid (foreign key -> products, nullable)
- rating: integer (1-5)
- comment: text
- helpful_count: integer
- verified_purchase: boolean
- status: enum (pending, approved, rejected)
- created_at: timestamp
```

### delivery_providers
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key -> users)
- business_id: uuid (foreign key -> businesses, nullable)
- vehicle_type: enum (motorbike, car, pmv, taxi, boat, truck)
- vehicle_registration: text
- license_number: text
- phone: text
- provinces_served: text[]
- districts_served: text[]
- rate_per_km: decimal
- base_rate: decimal
- active: boolean
- verified: boolean
- rating_avg: decimal
- rating_count: integer
- total_deliveries: integer
- created_at: timestamp
```

### deliveries
```sql
- id: uuid (primary key)
- order_id: uuid (foreign key -> orders)
- provider_id: uuid (foreign key -> delivery_providers)
- pickup_address: text
- pickup_lat: decimal
- pickup_lng: decimal
- delivery_address: text
- delivery_lat: decimal
- delivery_lng: decimal
- status: enum (pending, accepted, picked_up, in_transit, delivered, failed)
- fee: decimal
- distance_km: decimal
- pickup_time: timestamp
- delivered_time: timestamp
- proof_of_delivery_url: text
- notes: text
- created_at: timestamp
```

### wallets
```sql
- id: uuid (primary key)
- owner_type: enum (business, logistics)
- owner_id: uuid (references businesses or delivery_providers)
- balance: decimal
- pending_balance: decimal (funds on hold)
- total_earned: decimal
- total_withdrawn: decimal
- currency: text (PGK)
- created_at: timestamp
- updated_at: timestamp
```

### wallet_transactions
```sql
- id: uuid (primary key)
- wallet_id: uuid (foreign key -> wallets)
- type: enum (credit, debit, hold, release)
- amount: decimal
- balance_after: decimal
- related_order_id: uuid (foreign key -> orders, nullable)
- related_delivery_id: uuid (foreign key -> deliveries, nullable)
- description: text
- reference: text
- status: enum (pending, completed, failed)
- created_at: timestamp
```

### payout_requests
```sql
- id: uuid (primary key)
- wallet_id: uuid (foreign key -> wallets)
- amount: decimal
- method: enum (bank_transfer, mobile_money)
- bank_name: text
- account_number: text
- account_name: text
- mobile_provider: text (Digicel, Bmobile)
- mobile_number: text
- status: enum (pending, processing, completed, rejected)
- processed_by: uuid (foreign key -> users, nullable)
- processed_at: timestamp
- reference: text
- notes: text
- created_at: timestamp
```

### training_modules
```sql
- id: uuid (primary key)
- title: text
- slug: text
- description: text
- type: enum (video, pdf, article, webinar)
- content_url: text
- thumbnail_url: text
- category: text
- duration_minutes: integer
- difficulty: enum (beginner, intermediate, advanced)
- published: boolean
- view_count: integer
- created_by: uuid (foreign key -> users)
- created_at: timestamp
- updated_at: timestamp
```

### support_tickets
```sql
- id: uuid (primary key)
- ticket_number: text (unique)
- user_id: uuid (foreign key -> users)
- subject: text
- description: text
- category: enum (technical, payment, delivery, product, account, other)
- priority: enum (low, medium, high, urgent)
- status: enum (open, in_progress, waiting_user, resolved, closed)
- assigned_to: uuid (foreign key -> users, nullable)
- created_at: timestamp
- updated_at: timestamp
- resolved_at: timestamp
```

### announcements
```sql
- id: uuid (primary key)
- title: text
- content: text
- type: enum (general, training, event, alert)
- target_audience: enum (all, sellers, buyers, logistics, members)
- published: boolean
- published_at: timestamp
- expires_at: timestamp
- created_by: uuid (foreign key -> users)
- created_at: timestamp
```

## Indexes & Performance
- Index on business slug, status, sector, province
- Index on product slug, category_id, active, business_id
- Index on order buyer_user_id, seller_business_id, status, created_at
- Full-text search on product name, description
- Full-text search on business name, description
- Composite index on orders (seller_business_id, status, created_at)

## Row Level Security (RLS) Policies
- Users can read their own data
- Sellers can manage their own products and orders
- Buyers can view their own orders
- Admins have full access
- Public can read active products and verified businesses
