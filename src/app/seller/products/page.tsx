import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/constants';

export default async function SellerProductsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Get seller's business
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_user_id', user.id)
    .single();

  if (!business) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No Business Registered</h3>
            <p className="text-muted-foreground mb-4">
              You need to register your business before adding products
            </p>
            <Button asChild>
              <Link href="/seller/register">Register Business</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get products
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      category:categories(name)
    `)
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Products</h1>
          <p className="text-muted-foreground">
            Manage your product listings
          </p>
        </div>
        <Button asChild>
          <Link href="/seller/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products?.filter((p) => p.active).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products?.filter((p) => p.stock_qty === 0).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {products && products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].file_url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {product.category?.name || 'Uncategorized'}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={product.active ? 'default' : 'secondary'}>
                        {product.active ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                      {product.stock_qty === 0 && (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                      {product.featured && (
                        <Badge className="bg-amber-500">Featured</Badge>
                      )}
                    </div>
                  </div>

                  {/* Price & Stats */}
                  <div className="text-right hidden md:block">
                    <div className="font-bold text-lg">
                      {APP_CONFIG.currency_symbol}{product.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Stock: {product.stock_qty} {product.unit}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.view_count || 0} views
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/seller/products/${product.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start adding products to your store
              </p>
              <Button asChild>
                <Link href="/seller/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
