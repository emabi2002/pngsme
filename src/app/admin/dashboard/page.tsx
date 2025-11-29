import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Store, Package, TrendingUp } from 'lucide-react';

export default async function AdminDashboardPage() {
  const user = await getUser();

  if (!user || (user.role !== 'admin' && user.role !== 'council_admin')) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.full_name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Approved sellers
            </p>
          </CardContent>
        </Card>

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
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">K0.00</div>
            <p className="text-xs text-muted-foreground">
              Platform revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Administration</CardTitle>
            <CardDescription>
              Manage users, businesses, and platform settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/admin/users"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">User Management</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage user accounts
                </p>
              </a>
              <a
                href="/admin/businesses"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Business Approvals</h3>
                <p className="text-sm text-muted-foreground">
                  Review pending business registrations
                </p>
              </a>
              <a
                href="/admin/products"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Product Management</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor and moderate listings
                </p>
              </a>
              <a
                href="/admin/orders"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Orders & Transactions</h3>
                <p className="text-sm text-muted-foreground">
                  View all platform transactions
                </p>
              </a>
              <a
                href="/admin/categories"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Category Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage product categories
                </p>
              </a>
              <a
                href="/admin/settings"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Platform Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure platform parameters
                </p>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-600">Admin Access</Badge>
            </div>
            <CardTitle className="mt-2">Full Platform Control</CardTitle>
            <CardDescription>
              You have administrator privileges to manage all aspects of PNG SME Marketplace
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
