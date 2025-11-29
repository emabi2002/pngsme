'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Package, Truck, XCircle } from 'lucide-react';

interface OrderStatusButtonsProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusButtons({ orderId, currentStatus }: OrderStatusButtonsProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const updateOrderStatus = async (newStatus: string) => {
    setUpdating(true);
    const supabase = createClient();

    try {
      const updates: {
        status: string;
        confirmed_at?: string;
        delivered_at?: string;
      } = { status: newStatus };

      // Set timestamps for certain statuses
      if (newStatus === 'confirmed') {
        updates.confirmed_at = new Date().toISOString();
      } else if (newStatus === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  // Define possible status transitions
  const getAvailableActions = () => {
    switch (currentStatus) {
      case 'pending_payment':
        return [];
      case 'pending_confirmation':
        return [
          {
            label: 'Accept Order',
            status: 'confirmed',
            icon: CheckCircle2,
            variant: 'default' as const,
          },
          {
            label: 'Reject',
            status: 'cancelled',
            icon: XCircle,
            variant: 'destructive' as const,
          },
        ];
      case 'confirmed':
        return [
          {
            label: 'Mark as Packed',
            status: 'packed',
            icon: Package,
            variant: 'default' as const,
          },
        ];
      case 'packed':
        return [
          {
            label: 'Out for Delivery',
            status: 'out_for_delivery',
            icon: Truck,
            variant: 'default' as const,
          },
        ];
      case 'out_for_delivery':
        return [
          {
            label: 'Mark as Delivered',
            status: 'delivered',
            icon: CheckCircle2,
            variant: 'default' as const,
          },
        ];
      case 'delivered':
      case 'cancelled':
      case 'disputed':
      case 'refunded':
        return [];
      default:
        return [];
    }
  };

  const actions = getAvailableActions();

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.status}
            variant={action.variant}
            size="sm"
            onClick={() => updateOrderStatus(action.status)}
            disabled={updating}
          >
            <Icon className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
