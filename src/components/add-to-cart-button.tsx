'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { addToCart } from '@/lib/cart';
import type { Product } from '@/lib/types';

interface AddToCartButtonProps {
  product: Partial<Product>;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setAdding(false), 1500);
  };

  const increaseQuantity = () => {
    if (product.stock_qty && quantity < product.stock_qty) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const isOutOfStock = !product.stock_qty || product.stock_qty === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min="1"
            max={product.stock_qty}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              if (product.stock_qty && val <= product.stock_qty) {
                setQuantity(val);
              }
            }}
            className="w-20 border-0 text-center focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={increaseQuantity}
            disabled={!!product.stock_qty && quantity >= product.stock_qty}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          {product.unit}{quantity > 1 ? 's' : ''}
        </span>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={isOutOfStock || adding}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        {isOutOfStock ? 'Out of Stock' : adding ? 'Added to Cart!' : 'Add to Cart'}
      </Button>
    </div>
  );
}
