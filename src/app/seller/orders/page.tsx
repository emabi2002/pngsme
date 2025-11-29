import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { APP_CONFIG, ORDER_STATUS_LABELS } from '@/lib/constants';
import { Package, Clock, CheckCircle2, XCircle, MapPin, Phone, User } from 'lucide-react';
import { OrderStatusButtons } from '@/components/order-status-buttons';
import type { Order, OrderItem } from '@/lib/types';

export default async function SellerOrdersPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Get seller's business
  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('owner_user_id', user.id)
    .single();

  if (!business) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No Business Registered</h3>
            <p className="text-muted-foreground">
              You need to register your business to receive orders
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get orders for this seller
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(name, price, unit)
      ),
      buyer:users(full_name, phone, email)
    `)
    .eq('seller_business_id', business.id)
    .order('created_at', { ascending: false });

  // Calculate stats
  const pendingOrders = orders?.filter(o => o.status === 'pending_confirmation' || o.status === 'pending_payment').length || 0;
  const activeOrders = orders?.filter(o => ['confirmed', 'packed', 'out_for_delivery'].includes(o.status)).length || 0;
  const completedOrders = orders?.filter(o => o.status === 'delivered').length || 0;
  const totalRevenue = orders?.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total_amount, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">
          Manage and process your incoming orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {APP_CONFIG.currency_symbol}{totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
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
                        hour: '2-digit',
                        minute: '2-digit',
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
                    {order.payment_status === 'paid' ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                        Payment Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Customer</p>
                      <p className="font-medium">{order.buyer?.full_name}</p>
                    </div>
                  </div>
                  {order.delivery_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{order.delivery_phone}</p>
                      </div>
                    </div>
                  )}
                  {order.delivery_address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery</p>
                        <p className="font-medium text-sm">
                          {order.delivery_address}, {order.delivery_province}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-2">Items ({order.items?.length || 0})</h4>
                  <div className="space-y-2">
                    {order.items?.map((item: OrderItem) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.product?.name || item.product_snapshot?.name} x {item.quantity} {item.product?.unit}
                        </span>
                        <span className="font-medium">
                          {APP_CONFIG.currency_symbol}{item.total_price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Total and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Total: </span>
                    <span className="text-lg font-bold">
                      {APP_CONFIG.currency_symbol}{order.total_amount.toFixed(2)}
                    </span>
                  </div>

                  <OrderStatusButtons orderId={order.id} currentStatus={order.status} />
                </div>

                {order.delivery_notes && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Delivery Notes:</strong> {order.delivery_notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground">
              Orders will appear here when customers purchase your products
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
