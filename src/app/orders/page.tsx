import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG, ORDER_STATUS_LABELS } from '@/lib/constants';
import { Package, MapPin, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';
import type { Order, OrderItem } from '@/lib/types';

export default async function OrdersPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Get user's orders
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(name, price, unit)
      ),
      seller:businesses(name, slug, province)
    `)
    .eq('buyer_user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          View and track your order history
        </p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.order_number}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      className={`${
                        ORDER_STATUS_LABELS[order.status]?.color === 'green'
                          ? 'bg-green-100 text-green-800'
                          : ORDER_STATUS_LABELS[order.status]?.color === 'blue'
                          ? 'bg-blue-100 text-blue-800'
                          : ORDER_STATUS_LABELS[order.status]?.color === 'yellow'
                          ? 'bg-yellow-100 text-yellow-800'
                          : ORDER_STATUS_LABELS[order.status]?.color === 'red'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status]?.label || order.status}
                    </Badge>
                    {order.payment_status === 'paid' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Paid
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Seller Info */}
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Seller:</span>
                    <Link
                      href={`/seller/${order.seller?.slug}`}
                      className="text-primary hover:underline"
                    >
                      {order.seller?.name}
                    </Link>
                  </div>

                  {/* Delivery Info */}
                  {order.delivery_address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Delivery to:</span>
                        <p className="text-muted-foreground">
                          {order.delivery_address}, {order.delivery_province}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Items ({order.items?.length || 0})</h4>
                    <div className="space-y-2">
                      {order.items?.map((item: OrderItem) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {item.product?.name || item.product_snapshot?.name} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            {APP_CONFIG.currency_symbol}{item.total_price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold">
                      {APP_CONFIG.currency_symbol}{order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start shopping to see your orders here
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Browse Marketplace
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
