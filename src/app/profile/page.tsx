import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Calendar, Shield, User as UserIcon } from 'lucide-react';
import { LogoutButton } from '@/components/logout-button';

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const roleColors: Record<string, string> = {
    buyer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    seller: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    council_admin: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    logistics: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    support: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    banned: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your account information
        </p>
      </div>

      <div className="grid gap-6">
        {/* Account Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your personal details and account status</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={roleColors[user.role] || roleColors.buyer}>
                  {user.role.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge className={statusColors[user.status] || statusColors.active}>
                  {user.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Full Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{user.full_name}</p>
              </div>
            </div>

            <Separator />

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{user.email}</p>
                {user.verified_email ? (
                  <Badge variant="secondary" className="mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mt-1">
                    Not Verified
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{user.phone || 'Not provided'}</p>
                {user.phone && user.verified_phone ? (
                  <Badge variant="secondary" className="mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : user.phone ? (
                  <Badge variant="outline" className="mt-1">
                    Not Verified
                  </Badge>
                ) : null}
              </div>
            </div>

            <Separator />

            {/* Member Since */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.role === 'seller' && (
                <a
                  href="/seller/dashboard"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <h3 className="font-semibold mb-1">Seller Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your products and orders
                  </p>
                </a>
              )}
              {(user.role === 'admin' || user.role === 'council_admin') && (
                <a
                  href="/admin/dashboard"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <h3 className="font-semibold mb-1">Admin Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Platform administration
                  </p>
                </a>
              )}
              <a
                href="/orders"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">My Orders</h3>
                <p className="text-sm text-muted-foreground">
                  View your order history
                </p>
              </a>
              <a
                href="/wishlist"
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Wishlist</h3>
                <p className="text-sm text-muted-foreground">
                  Saved items and favorites
                </p>
              </a>
            </div>

            <Separator className="my-4" />

            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
