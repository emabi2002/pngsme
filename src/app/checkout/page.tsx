'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getCart, getCartTotal, clearCart } from '@/lib/cart';
import { createClient } from '@/lib/supabase/client';
import { APP_CONFIG, PNG_PROVINCES, PAYMENT_METHODS } from '@/lib/constants';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { CartItem } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string>('');

  const [formData, setFormData] = useState({
    deliveryMethod: 'seller_delivery',
    paymentMethod: 'cod',
    deliveryAddress: '',
    deliveryProvince: '',
    deliveryDistrict: '',
    deliveryPhone: '',
    deliveryNotes: '',
  });

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }
    setCartItems(cart);

    // Get user
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);

        // Get user profile for pre-filling
        supabase
          .from('users')
          .select('phone')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data?.phone) {
              setFormData((prev) => ({ ...prev, deliveryPhone: data.phone }));
            }
          });
      }
    });
  }, [router]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${dateStr}-${random}`;
  };

  const handlePlaceOrder = async () => {
    setError('');
    setLoading(true);

    if (!userId) {
      setError('You must be logged in to place an order');
      router.push(`/login?redirect=/checkout`);
      return;
    }

    const supabase = createClient();

    try {
      // Group cart items by seller
      const ordersBySeller = new Map<string, CartItem[]>();

      cartItems.forEach((item) => {
        const sellerId = item.product.business?.id;
        if (!sellerId) return;

        if (!ordersBySeller.has(sellerId)) {
          ordersBySeller.set(sellerId, []);
        }
        ordersBySeller.get(sellerId)!.push(item);
      });

      // Create an order for each seller
      for (const [sellerId, items] of ordersBySeller) {
        const subtotal = items.reduce(
          (sum, item) => sum + (item.product.price || 0) * item.quantity,
          0
        );
        const deliveryFee = APP_CONFIG.default_delivery_fee;
        const commissionAmount = subtotal * APP_CONFIG.commission_rate;
        const total = subtotal + deliveryFee;

        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            order_number: generateOrderNumber(),
            buyer_user_id: userId,
            seller_business_id: sellerId,
            subtotal,
            delivery_fee: deliveryFee,
            commission_amount: commissionAmount,
            total_amount: total,
            status: 'pending_payment',
            payment_status: 'pending',
            payment_method: formData.paymentMethod,
            delivery_method: formData.deliveryMethod,
            delivery_address: formData.deliveryAddress,
            delivery_province: formData.deliveryProvince,
            delivery_district: formData.deliveryDistrict,
            delivery_phone: formData.deliveryPhone,
            delivery_notes: formData.deliveryNotes,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price || 0,
          total_price: (item.product.price || 0) * item.quantity,
          product_snapshot: {
            name: item.product.name,
            description: item.product.description,
            image: item.product.images?.[0]?.file_url,
          },
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Clear cart
      clearCart();
      setSuccess(true);

      // Redirect to orders page
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Order Placed Successfully!</h3>
                <p className="text-muted-foreground">
                  Thank you for your order. You'll be redirected to your orders page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const deliveryFee = APP_CONFIG.default_delivery_fee;
  const total = subtotal + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your order
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Method *</label>
                <Select
                  value={formData.deliveryMethod}
                  onValueChange={(value: string) => updateFormData('deliveryMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Pickup from Seller</SelectItem>
                    <SelectItem value="seller_delivery">Seller Delivery</SelectItem>
                    <SelectItem value="logistics_partner">Third-Party Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.deliveryMethod !== 'pickup' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Delivery Address *</label>
                    <Input
                      placeholder="Enter your delivery address"
                      value={formData.deliveryAddress}
                      onChange={(e) => updateFormData('deliveryAddress', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Province *</label>
                      <Select
                        value={formData.deliveryProvince}
                        onValueChange={(value) => updateFormData('deliveryProvince', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {PNG_PROVINCES.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">District</label>
                      <Input
                        placeholder="Enter district"
                        value={formData.deliveryDistrict}
                        onChange={(e) => updateFormData('deliveryDistrict', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Phone *</label>
                    <Input
                      type="tel"
                      placeholder="+675 XXX XXXX"
                      value={formData.deliveryPhone}
                      onChange={(e) => updateFormData('deliveryPhone', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Delivery Notes (Optional)</label>
                    <textarea
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Any special instructions for delivery..."
                      value={formData.deliveryNotes}
                      onChange={(e) => updateFormData('deliveryNotes', e.target.value)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Payment Method *</label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value: string) => updateFormData('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.filter((pm) => pm.available).map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {APP_CONFIG.currency_symbol}
                      {((item.product.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {APP_CONFIG.currency_symbol}{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">
                    {APP_CONFIG.currency_symbol}{deliveryFee.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {APP_CONFIG.currency_symbol}{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={loading || !formData.deliveryPhone || (formData.deliveryMethod !== 'pickup' && !formData.deliveryAddress)}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
