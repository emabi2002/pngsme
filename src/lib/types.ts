// User & Authentication Types
export type UserRole = 'buyer' | 'seller' | 'logistics' | 'admin' | 'council_admin' | 'support';
export type UserStatus = 'active' | 'suspended' | 'banned';

export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  verified_phone: boolean;
  verified_email: boolean;
  created_at: string;
  updated_at: string;
}

// Business Types
export type BusinessType = 'formal' | 'informal';
export type BusinessStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Business {
  id: string;
  owner_user_id: string;
  name: string;
  slug: string;
  type: BusinessType;
  sector: string[];
  description: string;
  logo_url?: string;
  cover_image_url?: string;
  tin?: string;
  registration_no?: string;
  province: string;
  district: string;
  city_village: string;
  address: string;
  lat?: number;
  lng?: number;
  phone: string;
  email?: string;
  bank_name?: string;
  bank_account_no?: string;
  bank_account_name?: string;
  status: BusinessStatus;
  verified: boolean;
  rating_avg: number;
  rating_count: number;
  total_sales: number;
  created_at: string;
  updated_at: string;
}

// Product Types
export type ProductType = 'product' | 'service';

export interface Product {
  id: string;
  business_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  stock_qty: number;
  unit: string;
  sku?: string;
  type: ProductType;
  active: boolean;
  featured: boolean;
  rating_avg: number;
  rating_count: number;
  view_count: number;
  sale_count: number;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  business?: Partial<Business>;
  category?: Category;
}

export interface ProductImage {
  id: string;
  product_id: string;
  file_url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price_adjustment: number;
  stock_qty: number;
  sku?: string;
  active: boolean;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  display_order: number;
  active: boolean;
  created_at: string;
}

// Order Types
export type OrderStatus =
  | 'pending_payment'
  | 'pending_confirmation'
  | 'confirmed'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'disputed'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type PaymentMethod = 'cod' | 'bank_transfer' | 'wallet' | 'mobile_money' | 'card';
export type DeliveryMethod = 'pickup' | 'seller_delivery' | 'logistics_partner';

export interface Order {
  id: string;
  order_number: string;
  buyer_user_id: string;
  seller_business_id: string;
  subtotal: number;
  delivery_fee: number;
  commission_amount: number;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_reference?: string;
  delivery_method: DeliveryMethod;
  delivery_address?: string;
  delivery_province?: string;
  delivery_district?: string;
  delivery_phone?: string;
  delivery_notes?: string;
  buyer_notes?: string;
  seller_notes?: string;
  cancelled_by?: string;
  cancelled_reason?: string;
  confirmed_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  buyer?: User;
  seller?: Business;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_snapshot: {
    name: string;
    description: string;
    image?: string;
  };
  product?: Product;
}

// Review Types
export interface Review {
  id: string;
  order_id: string;
  reviewer_user_id: string;
  target_business_id: string;
  target_product_id?: string;
  rating: number;
  comment: string;
  helpful_count: number;
  verified_purchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewer?: User;
}

// Membership Types
export type MembershipTier = 'standard' | 'premium' | 'gold';
export type MembershipStatus = 'active' | 'expired' | 'cancelled';

export interface Membership {
  id: string;
  business_id?: string;
  user_id: string;
  membership_number: string;
  tier: MembershipTier;
  start_date: string;
  end_date: string;
  status: MembershipStatus;
  fee_paid: number;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

// Delivery Types
export type VehicleType = 'motorbike' | 'car' | 'pmv' | 'taxi' | 'boat' | 'truck';

export interface DeliveryProvider {
  id: string;
  user_id: string;
  business_id?: string;
  vehicle_type: VehicleType;
  vehicle_registration?: string;
  license_number?: string;
  phone: string;
  provinces_served: string[];
  districts_served: string[];
  rate_per_km: number;
  base_rate: number;
  active: boolean;
  verified: boolean;
  rating_avg: number;
  rating_count: number;
  total_deliveries: number;
  created_at: string;
}
