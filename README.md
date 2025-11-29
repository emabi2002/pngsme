# PNG SME Marketplace

> **Empowering Papua New Guinea's Small and Medium Enterprises**

A comprehensive digital marketplace platform connecting PNG businesses across all 22 provinces. Built with Next.js, TypeScript, Supabase, and shadcn/ui.

![Version](https://img.shields.io/badge/version-5.0-blue)
![Status](https://img.shields.io/badge/status-production_ready-green)
![Supabase](https://img.shields.io/badge/supabase-connected-green)

---

## 🎯 Features

### ✅ Fully Implemented

- **User Management**: Registration, login, profiles with role-based access
- **Business Registration**: 4-step wizard for seller onboarding
- **Product Management**: Add, edit, list products with multi-image uploads
- **Marketplace**: Browse, search, filter by category and province
- **Shopping Cart**: Add to cart, update quantities, persistent storage
- **Checkout & Orders**: Complete order flow with delivery and payment options
- **Seller Dashboard**: Order management, statistics, status updates
- **Product Detail Pages**: Image gallery, reviews, seller info
- **Review System**: Star ratings, purchase verification, admin moderation
- **Admin Dashboard**: Platform management and oversight

### 📦 Database

- **18 Tables**: Complete schema with relationships
- **Row Level Security**: Secure data access policies
- **11 Categories**: Pre-populated product categories
- **Storage Buckets**: Image upload infrastructure

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun** runtime
- **Supabase account** (free tier works)
- **Git** for version control

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd png-sme-marketplace
bun install
```

### 2. Environment Setup

Your `.env.local` is already configured with Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ksyygnnyhdzficipkgqi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Database Setup (IMPORTANT)

**Your database schema is already set up!** ✅

You only need to create the storage buckets:

1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/ksyygnnyhdzficipkgqi/sql
2. Click "New Query"
3. Copy content from `.same/supabase-storage-setup.sql`
4. Paste and click "Run"

**Verify Setup**:
```bash
bun run test:db
```

Expected output:
```
✅ Passed: 5
❌ Failed: 0
🎉 All tests passed!
```

### 4. Start Development Server

```bash
bun run dev
```

Open http://localhost:3001 in your browser.

### 5. Add Test Products (Optional)

Populate your marketplace with sample data:

**Quick Setup** (5 minutes):
- See: `.same/SIMPLE_TEST_DATA_SETUP.md`
- Or run: `bun run seed:data` (if auth configured)

**Manual Entry**:
1. Register at `/register`
2. Create business at `/seller/register`
3. Add products at `/seller/products/new`

See `.same/QUICKSTART_ADD_PRODUCTS.md` for details.

---

## 📚 Documentation

### Setup Guides
- **[Quick Setup Checklist](.same/QUICK_SETUP_CHECKLIST.md)** - Fastest way to get started (5 mins)
- **[Complete Setup Guide](.same/SUPABASE_SETUP_GUIDE.md)** - Detailed instructions
- **[Setup Flow Diagram](.same/SETUP_FLOW.md)** - Visual guide with diagrams

### Technical Documentation
- **[Features Completed](.same/FEATURES_COMPLETED.md)** - All implemented features
- **[Database Schema](.same/database-schema.md)** - Complete schema documentation
- **[Database Reference](.same/DATABASE_REFERENCE.md)** - Query examples and helpers
- **[Project Overview](.same/project-overview.md)** - Vision and roadmap

### SQL Files
- **[Main Schema](.same/supabase-schema.sql)** - Database tables and policies (ALREADY RUN ✅)
- **[Storage Setup](.same/supabase-storage-setup.sql)** - Image upload buckets (RUN THIS ⚠️)

---

## 🏗️ Project Structure

```
png-sme-marketplace/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── marketplace/       # Product browsing
│   │   ├── product/[slug]/    # Product details
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Order checkout
│   │   ├── orders/            # Order history
│   │   ├── seller/            # Seller dashboard & tools
│   │   ├── admin/             # Admin dashboard
│   │   ├── login/             # Authentication
│   │   └── register/          # User registration
│   │
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── header.tsx        # Navigation header
│   │   ├── footer.tsx        # Site footer
│   │   ├── product-card.tsx  # Product display
│   │   └── ...
│   │
│   └── lib/                  # Utilities and helpers
│       ├── supabase/         # Supabase clients
│       ├── db/               # Database helpers
│       ├── types.ts          # TypeScript types
│       ├── constants.ts      # PNG-specific data
│       ├── cart.ts           # Cart management
│       └── auth.ts           # Authentication
│
├── .same/                    # Documentation & SQL
│   ├── *.md                  # Setup guides
│   └── *.sql                 # Database migrations
│
└── scripts/                  # Helper scripts
    └── test-db-connection.ts # Database test
```

---

## 🎨 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Lucide Icons** - Icon system

### Backend
- **Supabase** - PostgreSQL database, auth, storage
- **Row Level Security** - Database-level security
- **Supabase Storage** - File uploads

### Tools
- **Bun** - Fast JavaScript runtime
- **ESLint** - Code linting
- **Biome** - Code formatting

---

## 📊 Database Schema

### Core Tables (18 total)

**Users & Auth**
- `users` - User profiles and roles
- `businesses` - Business registrations
- `memberships` - SME Council memberships

**Marketplace**
- `categories` - Product categories (11 seeded)
- `products` - Product listings
- `product_images` - Product photos
- `product_variants` - Product variations

**Orders & Commerce**
- `orders` - Customer orders
- `order_items` - Order line items
- `reviews` - Product & seller reviews

**Finance**
- `wallets` - Seller wallet balances
- `wallet_transactions` - Transaction history
- `payout_requests` - Withdrawal requests

**Logistics**
- `delivery_providers` - Delivery partners
- `deliveries` - Delivery tracking

**Support**
- `training_modules` - Business training
- `support_tickets` - Customer support
- `announcements` - Platform announcements

---

## 🧪 Testing

### Run Database Tests
```bash
bun run test:db
```

### Manual Testing
1. **Register** a seller account: http://localhost:3001/register
2. **Create business**: http://localhost:3001/seller/register
3. **Add product**: http://localhost:3001/seller/products/new
4. **Browse marketplace**: http://localhost:3001/marketplace
5. **Add to cart** and **checkout**
6. **Process orders** in seller dashboard

### Test Credentials
```
Admin Account:
- Email: admin@pngsme.com
- Password: demo123

(Create your own seller accounts for testing)
```

---

## 🎯 Usage

### For Buyers
1. **Browse** marketplace at `/marketplace`
2. **Search & filter** by category and province
3. **View** product details with images and reviews
4. **Add to cart** and manage quantities
5. **Checkout** with delivery and payment options
6. **Track orders** in order history

### For Sellers
1. **Register** business (4-step wizard)
2. **Add products** with multiple images
3. **Manage** product listings
4. **Process** incoming orders
5. **Update** order status
6. **Track** sales and revenue

### For Admins
1. **Manage** users and businesses
2. **Approve** business registrations
3. **Moderate** product reviews
4. **View** platform statistics
5. **Configure** system settings

---

## 🚧 Roadmap

### Phase 1: MVP (Current - Version 5) ✅
- [x] User authentication
- [x] Business registration
- [x] Product management
- [x] Marketplace browse
- [x] Shopping cart & checkout
- [x] Order management
- [x] Product details & reviews
- [x] Seller dashboard

### Phase 2: Payments & Logistics (Next)
- [ ] Wallet system
- [ ] BSP Pay integration
- [ ] Logistics partner module
- [ ] Delivery tracking
- [ ] Email/SMS notifications
- [ ] Advanced analytics

### Phase 3: Advanced Features (Future)
- [ ] Mobile apps (iOS/Android)
- [ ] B2B procurement
- [ ] Credit scoring
- [ ] API for third-parties
- [ ] Advanced business tools

---

## 🤝 Contributing

This is a production project for PNG SME Marketplace. For feature requests or issues, please contact the development team.

---

## 📝 Scripts

```bash
# Development
bun run dev          # Start dev server

# Testing
bun run test:db      # Test database connection

# Build
bun run build        # Build for production
bun run start        # Start production server

# Code Quality
bun run lint         # Run ESLint
bun run format       # Format with Biome
```

---

## 🆘 Support

### Documentation
- Setup issues: See `.same/SUPABASE_SETUP_GUIDE.md`
- Feature questions: See `.same/FEATURES_COMPLETED.md`
- Database queries: See `.same/DATABASE_REFERENCE.md`

### Common Issues
1. **Database not connected**: Run `bun run test:db` to diagnose
2. **Images not uploading**: Run `.same/supabase-storage-setup.sql`
3. **RLS errors**: Check Row Level Security policies
4. **Build errors**: Clear `.next` folder and rebuild

---

## 📄 License

Copyright © 2025 PNG SME Marketplace. All rights reserved.

---

## 🎉 Status

**Current Version**: 5.0
**Status**: Production Ready (pending storage setup)
**Database**: ✅ Connected and configured
**Storage**: ⚠️ Needs bucket creation (1 SQL file)
**Features**: 40+ core features implemented

**Next Step**: Run `.same/supabase-storage-setup.sql` to enable image uploads!

---

**Built with ❤️ for Papua New Guinea's entrepreneurs**

🇵🇬 **Proudly Papua New Guinean**
