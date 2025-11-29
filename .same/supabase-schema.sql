-- PNG SME Marketplace Database Schema
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- Create enum types
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'logistics', 'admin', 'council_admin', 'support');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned');
CREATE TYPE business_type AS ENUM ('formal', 'informal');
CREATE TYPE business_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE product_type AS ENUM ('product', 'service');
CREATE TYPE order_status AS ENUM (
  'pending_payment',
  'pending_confirmation',
  'confirmed',
  'packed',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'disputed',
  'refunded'
);
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE payment_method AS ENUM ('cod', 'bank_transfer', 'wallet', 'mobile_money', 'card');
CREATE TYPE delivery_method AS ENUM ('pickup', 'seller_delivery', 'logistics_partner');
CREATE TYPE vehicle_type AS ENUM ('motorbike', 'car', 'pmv', 'taxi', 'boat', 'truck');
CREATE TYPE membership_tier AS ENUM ('standard', 'premium', 'gold');
CREATE TYPE membership_status AS ENUM ('active', 'expired', 'cancelled');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'buyer',
  status user_status NOT NULL DEFAULT 'active',
  verified_phone BOOLEAN DEFAULT FALSE,
  verified_email BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type business_type NOT NULL,
  sector TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  tin TEXT, -- Tax Identification Number
  registration_no TEXT, -- IPA registration
  province TEXT NOT NULL,
  district TEXT,
  city_village TEXT,
  address TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  phone TEXT NOT NULL,
  email TEXT,
  bank_name TEXT,
  bank_account_no TEXT,
  bank_account_name TEXT,
  status business_status NOT NULL DEFAULT 'pending',
  verified BOOLEAN DEFAULT FALSE,
  rating_avg DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  total_sales DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  stock_qty INTEGER DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'piece',
  sku TEXT,
  type product_type DEFAULT 'product',
  active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  rating_avg DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  sale_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, slug)
);

-- Product images table
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product variants table
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_adjustment DECIMAL(10, 2) DEFAULT 0,
  stock_qty INTEGER DEFAULT 0,
  sku TEXT,
  active BOOLEAN DEFAULT TRUE
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  buyer_user_id UUID NOT NULL REFERENCES public.users(id),
  seller_business_id UUID NOT NULL REFERENCES public.businesses(id),
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  commission_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending_payment',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_method payment_method,
  payment_reference TEXT,
  delivery_method delivery_method,
  delivery_address TEXT,
  delivery_province TEXT,
  delivery_district TEXT,
  delivery_phone TEXT,
  delivery_notes TEXT,
  buyer_notes TEXT,
  seller_notes TEXT,
  cancelled_by UUID REFERENCES public.users(id),
  cancelled_reason TEXT,
  confirmed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_variant_id UUID REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  product_snapshot JSONB NOT NULL -- Store product details for history
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  reviewer_user_id UUID NOT NULL REFERENCES public.users(id),
  target_business_id UUID NOT NULL REFERENCES public.businesses(id),
  target_product_id UUID REFERENCES public.products(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT TRUE,
  status review_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memberships table
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.businesses(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  membership_number TEXT UNIQUE NOT NULL,
  tier membership_tier NOT NULL DEFAULT 'standard',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status membership_status NOT NULL DEFAULT 'active',
  fee_paid DECIMAL(10, 2) NOT NULL,
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery providers table
CREATE TABLE public.delivery_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  business_id UUID REFERENCES public.businesses(id),
  vehicle_type vehicle_type NOT NULL,
  vehicle_registration TEXT,
  license_number TEXT,
  phone TEXT NOT NULL,
  provinces_served TEXT[] DEFAULT '{}',
  districts_served TEXT[] DEFAULT '{}',
  rate_per_km DECIMAL(10, 2),
  base_rate DECIMAL(10, 2),
  active BOOLEAN DEFAULT TRUE,
  verified BOOLEAN DEFAULT FALSE,
  rating_avg DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deliveries table
CREATE TABLE public.deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  provider_id UUID REFERENCES public.delivery_providers(id),
  pickup_address TEXT NOT NULL,
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  delivery_address TEXT NOT NULL,
  delivery_lat DECIMAL(10, 8),
  delivery_lng DECIMAL(11, 8),
  status order_status NOT NULL,
  fee DECIMAL(10, 2) NOT NULL,
  distance_km DECIMAL(10, 2),
  pickup_time TIMESTAMPTZ,
  delivered_time TIMESTAMPTZ,
  proof_of_delivery_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallets table
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_type TEXT NOT NULL, -- 'business' or 'logistics'
  owner_id UUID NOT NULL,
  balance DECIMAL(12, 2) DEFAULT 0,
  pending_balance DECIMAL(12, 2) DEFAULT 0,
  total_earned DECIMAL(12, 2) DEFAULT 0,
  total_withdrawn DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'PGK',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(owner_type, owner_id)
);

-- Wallet transactions table
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id),
  type TEXT NOT NULL, -- 'credit', 'debit', 'hold', 'release'
  amount DECIMAL(12, 2) NOT NULL,
  balance_after DECIMAL(12, 2) NOT NULL,
  related_order_id UUID REFERENCES public.orders(id),
  related_delivery_id UUID REFERENCES public.deliveries(id),
  description TEXT,
  reference TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payout requests table
CREATE TABLE public.payout_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id),
  amount DECIMAL(12, 2) NOT NULL,
  method TEXT NOT NULL, -- 'bank_transfer', 'mobile_money'
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,
  mobile_provider TEXT,
  mobile_number TEXT,
  status TEXT DEFAULT 'pending',
  processed_by UUID REFERENCES public.users(id),
  processed_at TIMESTAMPTZ,
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training modules table
CREATE TABLE public.training_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'video', 'pdf', 'article', 'webinar'
  content_url TEXT,
  thumbnail_url TEXT,
  category TEXT,
  duration_minutes INTEGER,
  difficulty TEXT, -- 'beginner', 'intermediate', 'advanced'
  published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  assigned_to UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_phone ON public.users(phone);
CREATE INDEX idx_users_role ON public.users(role);

-- Businesses indexes
CREATE INDEX idx_businesses_owner ON public.businesses(owner_user_id);
CREATE INDEX idx_businesses_slug ON public.businesses(slug);
CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_businesses_province ON public.businesses(province);
CREATE INDEX idx_businesses_sector ON public.businesses USING GIN(sector);
CREATE INDEX idx_businesses_verified ON public.businesses(verified);

-- Products indexes
CREATE INDEX idx_products_business ON public.products(business_id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(active);
CREATE INDEX idx_products_featured ON public.products(featured);
CREATE INDEX idx_products_name_search ON public.products USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Orders indexes
CREATE INDEX idx_orders_buyer ON public.orders(buyer_user_id);
CREATE INDEX idx_orders_seller ON public.orders(seller_business_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX idx_orders_number ON public.orders(order_number);

-- Reviews indexes
CREATE INDEX idx_reviews_business ON public.reviews(target_business_id);
CREATE INDEX idx_reviews_product ON public.reviews(target_product_id);
CREATE INDEX idx_reviews_status ON public.reviews(status);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Anyone can view approved businesses" ON public.businesses
  FOR SELECT USING (status = 'approved' OR owner_user_id = auth.uid());

CREATE POLICY "Business owners can update their business" ON public.businesses
  FOR UPDATE USING (owner_user_id = auth.uid());

CREATE POLICY "Authenticated users can create businesses" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

-- Categories policies (public read)
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (active = TRUE);

-- Products policies
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (active = TRUE);

CREATE POLICY "Business owners can manage their products" ON public.products
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
    )
  );

-- Product images policies
CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (TRUE);

CREATE POLICY "Business owners can manage product images" ON public.product_images
  FOR ALL USING (
    product_id IN (
      SELECT p.id FROM public.products p
      JOIN public.businesses b ON p.business_id = b.id
      WHERE b.owner_user_id = auth.uid()
    )
  );

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (
    buyer_user_id = auth.uid() OR
    seller_business_id IN (
      SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can create orders" ON public.orders
  FOR INSERT WITH CHECK (buyer_user_id = auth.uid());

CREATE POLICY "Buyers and sellers can update orders" ON public.orders
  FOR UPDATE USING (
    buyer_user_id = auth.uid() OR
    seller_business_id IN (
      SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
    )
  );

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON public.order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM public.orders WHERE
        buyer_user_id = auth.uid() OR
        seller_business_id IN (
          SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
        )
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can create reviews for their orders" ON public.reviews
  FOR INSERT WITH CHECK (reviewer_user_id = auth.uid());

-- Training modules policies
CREATE POLICY "Anyone can view published training" ON public.training_modules
  FOR SELECT USING (published = TRUE);

-- Support tickets policies
CREATE POLICY "Users can view their own tickets" ON public.support_tickets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Announcements policies
CREATE POLICY "Anyone can view published announcements" ON public.announcements
  FOR SELECT USING (published = TRUE AND (expires_at IS NULL OR expires_at > NOW()));

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_modules_updated_at BEFORE UPDATE ON public.training_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate membership number
CREATE OR REPLACE FUNCTION generate_membership_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'MEM-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon, display_order) VALUES
  ('Fresh Produce', 'fresh-produce', 'Vegetables, fruits, and root crops', '🥬', 1),
  ('Livestock & Meat', 'livestock-meat', 'Chicken, pork, fish', '🐷', 2),
  ('Cash Crops', 'cash-crops', 'Coffee, cocoa, vanilla, spices', '☕', 3),
  ('Handicrafts', 'handicrafts', 'Bilums, carvings, traditional artifacts', '🎨', 4),
  ('Art & Clothing', 'art-clothing', 'Traditional wear, accessories', '👗', 5),
  ('Processed Foods', 'processed-foods', 'Peanut butter, coconut oil', '🥜', 6),
  ('Household Goods', 'household-goods', 'Furniture, kitchenware', '🏠', 7),
  ('Personal Care', 'personal-care', 'Cosmetics, soap, skincare', '🧴', 8),
  ('Professional Services', 'professional-services', 'Accounting, legal, IT', '💼', 9),
  ('Trades & Construction', 'trades-construction', 'Carpentry, electrical, plumbing', '🔧', 10),
  ('Transport & Delivery', 'transport-delivery', 'PMV, taxi, delivery', '🚗', 11);

COMMENT ON DATABASE postgres IS 'PNG SME Marketplace - Empowering PNG Businesses';
