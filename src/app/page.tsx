import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product-card';
import { ArrowRight, Store, Users, TrendingUp, Shield, Truck, HeadphonesIcon } from 'lucide-react';
import { BUSINESS_SECTORS, PRODUCT_CATEGORIES } from '@/lib/constants';
import type { Product, Business } from '@/lib/types';

// Mock featured products for demonstration
const featuredProducts: Partial<Product>[] = [
  {
    id: '1',
    name: 'Fresh Kaukau (Sweet Potato)',
    slug: 'fresh-kaukau',
    price: 15.00,
    compare_at_price: 20.00,
    unit: 'kg',
    rating_avg: 4.8,
    rating_count: 24,
    featured: true,
    business: {
      name: 'Highland Fresh Produce',
      slug: 'highland-fresh',
      province: 'Eastern Highlands',
    } as Partial<Business>,
  },
  {
    id: '2',
    name: 'Traditional Bilum - Handwoven',
    slug: 'traditional-bilum',
    price: 85.00,
    unit: 'piece',
    rating_avg: 5.0,
    rating_count: 18,
    featured: true,
    business: {
      name: 'Sepik Handicrafts',
      slug: 'sepik-handicrafts',
      province: 'East Sepik',
    } as Partial<Business>,
  },
  {
    id: '3',
    name: 'Organic Coffee Beans - PNG Highlands',
    slug: 'organic-coffee-beans',
    price: 45.00,
    unit: 'kg',
    rating_avg: 4.9,
    rating_count: 31,
    business: {
      name: 'Mountain Coffee Co',
      slug: 'mountain-coffee',
      province: 'Western Highlands',
    } as Partial<Business>,
  },
  {
    id: '4',
    name: 'Fresh Coconut Oil - Cold Pressed',
    slug: 'coconut-oil',
    price: 25.00,
    unit: 'litre',
    rating_avg: 4.7,
    rating_count: 15,
    business: {
      name: 'Coastal Naturals',
      slug: 'coastal-naturals',
      province: 'Milne Bay',
    } as Partial<Business>,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 text-sm">🇵🇬 Proudly Papua New Guinean</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Empowering PNG's <span className="text-orange-600">Small Businesses</span> to Thrive
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Connect with local sellers across all 22 provinces. Buy fresh produce, handicrafts, and services
              while supporting PNG SMEs and MSMEs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg" asChild>
                <Link href="/marketplace">
                  Browse Marketplace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg" asChild>
                <Link href="/seller/register">
                  <Store className="mr-2 h-5 w-5" />
                  Become a Seller
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div>
                <div className="text-3xl font-bold text-orange-600">500+</div>
                <div className="text-sm text-muted-foreground">Active Sellers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">2,000+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">22</div>
                <div className="text-sm text-muted-foreground">Provinces</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover products and services from PNG's diverse business sectors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {BUSINESS_SECTORS.slice(0, 10).map((sector) => (
              <Link key={sector.value} href={`/marketplace?sector=${sector.value}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {sector.icon}
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {sector.label}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/categories">
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Top picks from verified sellers</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link href="/marketplace">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" asChild>
              <Link href="/marketplace">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why PNG SME Marketplace?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're more than just a marketplace - we're your partner in business growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                  <Store className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Support Local Businesses</h3>
                <p className="text-muted-foreground">
                  Every purchase directly supports PNG SMEs and helps local economies grow
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Verified Sellers</h3>
                <p className="text-muted-foreground">
                  All sellers are verified through our KYC process for your peace of mind
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Nationwide Delivery</h3>
                <p className="text-muted-foreground">
                  We connect you with delivery partners serving all 22 provinces
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Business Community</h3>
                <p className="text-muted-foreground">
                  Join 500+ SMEs in our growing business network and community
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Business Tools</h3>
                <p className="text-muted-foreground">
                  Free tools for inventory, sales tracking, and business management
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                  <HeadphonesIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Local Support</h3>
                <p className="text-muted-foreground">
                  PNG-based support team that understands your needs and challenges
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of PNG businesses already selling on our platform.
            It's free to start and takes less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg" asChild>
              <Link href="/seller/register">
                Start Selling Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white/10" asChild>
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
