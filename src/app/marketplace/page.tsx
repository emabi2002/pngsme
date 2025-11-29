import { getProducts } from '@/lib/db/products';
import { getCategories } from '@/lib/db/categories';
import { ProductCard } from '@/components/product-card';
import { MarketplaceFilters } from '@/components/marketplace-filters';
import { Suspense } from 'react';
import { ProductGridSkeleton } from '@/components/product-grid-skeleton';

interface SearchParams {
  search?: string;
  category?: string;
  province?: string;
  sort?: string;
  page?: string;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await searchParams in Next.js 15
  const params = await searchParams;

  const page = parseInt(params.page || '1');
  const limit = 12;
  const offset = (page - 1) * limit;

  // Fetch products and categories in parallel
  const [products, categories] = await Promise.all([
    getProducts({
      limit,
      offset,
      search: params.search,
      category: params.category,
    }),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Browse Marketplace</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Discover products and services from PNG's finest SMEs and MSMEs across all 22 provinces
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div>Loading filters...</div>}>
              <MarketplaceFilters categories={categories} />
            </Suspense>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {searchParams.search ? `Results for "${searchParams.search}"` : 'All Products'}
                </h2>
                <p className="text-muted-foreground">
                  Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              {/* Sort Dropdown */}
              <select className="border rounded-md px-4 py-2 text-sm">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Product Grid */}
            <Suspense fallback={<ProductGridSkeleton />}>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </Suspense>

            {/* Pagination */}
            {products.length >= limit && (
              <div className="mt-8 flex justify-center gap-2">
                <a
                  href={`/marketplace?page=${page - 1}`}
                  className={`px-4 py-2 border rounded-md ${
                    page <= 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-accent'
                  }`}
                >
                  Previous
                </a>
                <span className="px-4 py-2">Page {page}</span>
                <a
                  href={`/marketplace?page=${page + 1}`}
                  className="px-4 py-2 border rounded-md hover:bg-accent"
                >
                  Next
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
