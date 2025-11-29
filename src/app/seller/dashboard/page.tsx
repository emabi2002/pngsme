import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, TrendingUp, Eye, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function SellerDashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  // For now, allow all logged-in users to access (in production, check if they have a business)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.full_name}
          </p>
        </div>
        <Button asChild>
          <Link href="/seller/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Active listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              All time orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">K0.00</div>
            <p className="text-xs text-muted-foreground">
              Revenue earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Total impressions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your products and business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/seller/products"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">My Products</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage your listings
                </p>
              </Link>
              <Link
                href="/seller/orders"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Orders</h3>
                <p className="text-sm text-muted-foreground">
                  Process customer orders
                </p>
              </Link>
              <Link
                href="/seller/business"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Business Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Update your business information
                </p>
              </Link>
              <Link
                href="/seller/analytics"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  View sales and performance data
                </p>
              </Link>
              <Link
                href="/seller/wallet"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Manage earnings and payouts
                </p>
              </Link>
              <Link
                href="/training"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Training</h3>
                <p className="text-sm text-muted-foreground">
                  Learn and grow your business
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Ready to start selling on PNG SME Marketplace?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              Complete these steps to start receiving orders:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">1</div>
                <span>Register your business profile</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">2</div>
                <span>Add your first product</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">3</div>
                <span>Set up payment details</span>
              </li>
            </ul>
            <Button className="w-full" asChild>
              <Link href="/seller/register">
                Complete Business Registration
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
