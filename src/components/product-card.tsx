'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { APP_CONFIG } from '@/lib/constants';
import { addToCart } from '@/lib/cart';
import { useState } from 'react';

interface ProductCardProps {
  product: Partial<Product>;
}

export function ProductCard({ product }: ProductCardProps) {
  const [adding, setAdding] = useState(false);

  const hasDiscount = product.compare_at_price && product.compare_at_price > (product.price || 0);
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price!) / product.compare_at_price!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product, 1);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.slug || product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images?.[0]?.file_url ? (
            <Image
              src={product.images[0].file_url}
              alt={product.name || 'Product'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              📦
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              -{discountPercent}%
            </Badge>
          )}
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-amber-500">
              Featured
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/product/${product.slug || product.id}`}>
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {product.business && (
          <Link href={`/seller/${product.business.slug || product.business.id}`}>
            <p className="text-sm text-muted-foreground mt-1 hover:text-primary transition-colors">
              {product.business.name}
            </p>
          </Link>
        )}

        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium ml-1">
              {product.rating_avg?.toFixed(1) || '0.0'}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.rating_count || 0})
          </span>
        </div>

        {product.business?.province && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{product.business.province}</span>
          </div>
        )}

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
              {APP_CONFIG.currency_symbol}{product.price?.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {APP_CONFIG.currency_symbol}{product.compare_at_price?.toFixed(2)}
              </span>
            )}
          </div>
          {product.unit && (
            <span className="text-xs text-muted-foreground">per {product.unit}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          size="sm"
          onClick={handleAddToCart}
          disabled={adding}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {adding ? 'Added!' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
