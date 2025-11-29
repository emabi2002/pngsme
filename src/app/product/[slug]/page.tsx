import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Store, Package, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';
import { ProductImageGallery } from '@/components/product-image-gallery';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { ProductReviews } from '@/components/product-reviews';
import Link from 'next/link';

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();

  // Get product with all related data
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      business:businesses(*),
      category:categories(name),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('slug', params.slug)
    .eq('active', true)
    .single();

  if (error || !product) {
    notFound();
  }

  // Get reviews for this product
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:users(full_name)
    `)
    .eq('target_product_id', product.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(10);

  // Increment view count
  await supabase.rpc('increment_product_view', { product_id: product.id });

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <ProductImageGallery images={product.images || []} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <Badge variant="secondary">{product.category.name}</Badge>
            )}

            {/* Product Name */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
              {product.description && (
                <p className="text-muted-foreground">{product.description}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="text-lg font-semibold">
                  {product.rating_avg?.toFixed(1) || '0.0'}
                </span>
              </div>
              <span className="text-muted-foreground">
                ({product.rating_count || 0} reviews)
              </span>
              {product.featured && (
                <Badge className="bg-amber-500">Featured</Badge>
              )}
            </div>

            <Separator />

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">
                  {APP_CONFIG.currency_symbol}{product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {APP_CONFIG.currency_symbol}{product.compare_at_price.toFixed(2)}
                    </span>
                    <Badge variant="destructive">-{discountPercent}% OFF</Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">per {product.unit}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className={product.stock_qty > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock_qty > 0
                  ? `${product.stock_qty} ${product.unit}${product.stock_qty > 1 ? 's' : ''} in stock`
                  : 'Out of stock'}
              </span>
            </div>

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            <Separator />

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {product.business.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/seller/${product.business.slug}`}
                      className="font-semibold text-lg hover:text-primary transition-colors"
                    >
                      {product.business.name}
                    </Link>
                    {product.business.verified && (
                      <div className="flex items-center gap-1 mt-1">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Verified Seller</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{product.business.province}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div>
                        <span className="font-semibold">{product.business.rating_avg?.toFixed(1) || '0.0'}</span>
                        <span className="text-sm text-muted-foreground"> rating</span>
                      </div>
                      <div>
                        <span className="font-semibold">{product.business.rating_count || 0}</span>
                        <span className="text-sm text-muted-foreground"> reviews</span>
                      </div>
                    </div>
                    <Link href={`/seller/${product.business.slug}`}>
                      <button className="mt-4 w-full border rounded-md py-2 hover:bg-accent transition-colors">
                        <Store className="h-4 w-4 inline mr-2" />
                        Visit Store
                      </button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews
          productId={product.id}
          reviews={reviews || []}
          averageRating={product.rating_avg || 0}
          totalReviews={product.rating_count || 0}
        />
      </div>
    </div>
  );
}
