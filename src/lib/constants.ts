// PNG Provinces and Regions
export const PNG_PROVINCES = [
  // Highlands Region
  'Eastern Highlands',
  'Chimbu (Simbu)',
  'Western Highlands',
  'Southern Highlands',
  'Enga',
  'Hela',
  'Jiwaka',

  // Momase Region
  'Morobe',
  'Madang',
  'East Sepik',
  'Sandaun (West Sepik)',

  // New Guinea Islands Region
  'New Ireland',
  'East New Britain',
  'West New Britain',
  'Manus',
  'Bougainville',

  // Papua Region
  'Central',
  'Gulf',
  'Milne Bay',
  'Oro (Northern)',
  'Western',

  // National Capital District
  'National Capital District (NCD)',
] as const;

// Business Sectors for SMEs in PNG
export const BUSINESS_SECTORS = [
  // Core MVP Sectors
  { value: 'agriculture', label: 'Agriculture & Fresh Produce', icon: '🌾' },
  { value: 'handicrafts', label: 'Handicrafts & Arts', icon: '🎨' },
  { value: 'retail', label: 'Retail & Trading', icon: '🏪' },

  // Other Sectors
  { value: 'food_beverage', label: 'Food & Beverage', icon: '🍽️' },
  { value: 'transport_logistics', label: 'Transport & Logistics', icon: '🚚' },
  { value: 'construction_trades', label: 'Construction & Trades', icon: '🔨' },
  { value: 'manufacturing', label: 'Manufacturing & Production', icon: '🏭' },
  { value: 'professional_services', label: 'Professional Services', icon: '💼' },
  { value: 'digital_services', label: 'Digital & IT Services', icon: '💻' },
  { value: 'tourism_hospitality', label: 'Tourism & Hospitality', icon: '🏨' },
  { value: 'health_wellness', label: 'Health & Wellness', icon: '⚕️' },
  { value: 'education_training', label: 'Education & Training', icon: '📚' },
  { value: 'finance_micro', label: 'Finance & Micro-lending', icon: '💰' },
  { value: 'informal_market', label: 'Informal Market & Vending', icon: '🛒' },
  { value: 'other', label: 'Other', icon: '📦' },
] as const;

// Product Categories
export const PRODUCT_CATEGORIES = [
  // Agriculture & Fresh Produce
  {
    name: 'Fresh Produce',
    slug: 'fresh-produce',
    icon: '🥬',
    subcategories: [
      'Vegetables',
      'Fruits',
      'Root Crops (Kaukau, Taro)',
      'Greens & Herbs',
      'Coconuts & Nuts',
    ],
  },
  {
    name: 'Livestock & Meat',
    slug: 'livestock-meat',
    icon: '🐷',
    subcategories: [
      'Chicken & Poultry',
      'Pork',
      'Goat',
      'Fresh Fish',
      'Smoked Fish',
    ],
  },
  {
    name: 'Cash Crops',
    slug: 'cash-crops',
    icon: '☕',
    subcategories: [
      'Coffee',
      'Cocoa',
      'Vanilla',
      'Spices',
      'Betel Nut',
    ],
  },

  // Handicrafts & Local Products
  {
    name: 'Handicrafts',
    slug: 'handicrafts',
    icon: '🎨',
    subcategories: [
      'Bilums',
      'Wood Carvings',
      'Traditional Artifacts',
      'Pottery & Clay',
      'Woven Items',
    ],
  },
  {
    name: 'Art & Clothing',
    slug: 'art-clothing',
    icon: '👗',
    subcategories: [
      'Traditional Wear',
      'Modern Clothing',
      'Accessories',
      'Jewelry',
      'Paintings & Art',
    ],
  },

  // Retail & General Goods
  {
    name: 'Processed Foods',
    slug: 'processed-foods',
    icon: '🥜',
    subcategories: [
      'Peanut Butter',
      'Coconut Oil',
      'Dried Fruits',
      'Flour & Grains',
      'Honey',
    ],
  },
  {
    name: 'Household Goods',
    slug: 'household-goods',
    icon: '🏠',
    subcategories: [
      'Cleaning Products',
      'Kitchenware',
      'Furniture',
      'Bedding',
      'Décor',
    ],
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    icon: '🧴',
    subcategories: [
      'Cosmetics',
      'Soap & Hygiene',
      'Hair Products',
      'Skincare',
      'Traditional Medicine',
    ],
  },

  // Services
  {
    name: 'Professional Services',
    slug: 'professional-services',
    icon: '💼',
    subcategories: [
      'Accounting',
      'Legal Support',
      'Marketing & Design',
      'IT Services',
      'Photography',
    ],
  },
  {
    name: 'Trades & Construction',
    slug: 'trades-construction',
    icon: '🔧',
    subcategories: [
      'Carpentry',
      'Electrical',
      'Plumbing',
      'Welding',
      'Painting',
    ],
  },
  {
    name: 'Transport & Delivery',
    slug: 'transport-delivery',
    icon: '🚗',
    subcategories: [
      'PMV Services',
      'Taxi & Hire Cars',
      'Delivery Services',
      'Moving Services',
      'Boat Transport',
    ],
  },
] as const;

// Product Units
export const PRODUCT_UNITS = [
  'piece',
  'kg',
  'gram',
  'bunch',
  'bag',
  'dozen',
  'litre',
  'meter',
  'set',
  'pair',
  'box',
  'packet',
  'hour',
  'day',
] as const;

// Order Status Display
export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: 'Pending Payment', color: 'yellow' },
  pending_confirmation: { label: 'Pending Confirmation', color: 'orange' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  packed: { label: 'Packed', color: 'purple' },
  out_for_delivery: { label: 'Out for Delivery', color: 'indigo' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
  disputed: { label: 'Disputed', color: 'red' },
  refunded: { label: 'Refunded', color: 'gray' },
};

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', available: true },
  { value: 'bank_transfer', label: 'Bank Transfer', available: true },
  { value: 'wallet', label: 'Wallet', available: false }, // Phase 2
  { value: 'mobile_money', label: 'Mobile Money (M-Pawa/MiBank)', available: false }, // Phase 2
  { value: 'card', label: 'Credit/Debit Card', available: false }, // Phase 2
] as const;

// PNG Banks
export const PNG_BANKS = [
  'Bank South Pacific (BSP)',
  'Kina Bank',
  'ANZ PNG',
  'Westpac PNG',
  'MiBank',
  'Teachers Savings & Loan',
  'PNG Microfinance Limited',
] as const;

// Mobile Money Providers
export const MOBILE_MONEY_PROVIDERS = [
  'M-Pawa (Digicel)',
  'MiBank Mobile',
  'BSP Mobile',
] as const;

// Application Settings
export const APP_CONFIG = {
  name: 'PNG SME Marketplace',
  tagline: 'Empowering PNG Businesses',
  commission_rate: 0.05, // 5% commission
  min_order_amount: 5, // PGK 5
  currency: 'PGK',
  currency_symbol: 'K',
  default_delivery_fee: 10, // PGK 10
  support_email: 'support@pngsme.market',
  support_phone: '+675 XXX XXXX',
} as const;

// Membership Tiers
export const MEMBERSHIP_TIERS = [
  {
    value: 'standard',
    label: 'Standard',
    annual_fee: 100, // PGK
    features: [
      'Basic seller profile',
      'Up to 20 product listings',
      'Access to marketplace',
      'Basic support',
    ],
  },
  {
    value: 'premium',
    label: 'Premium',
    annual_fee: 250, // PGK
    features: [
      'Enhanced seller profile',
      'Up to 100 product listings',
      'Priority placement in search',
      'Business tools & reports',
      'Training access',
      'Priority support',
    ],
  },
  {
    value: 'gold',
    label: 'Gold',
    annual_fee: 500, // PGK
    features: [
      'Premium seller profile',
      'Unlimited product listings',
      'Featured placement',
      'Advanced business tools',
      'Full training library',
      'Dedicated support',
      'Marketing assistance',
    ],
  },
] as const;
