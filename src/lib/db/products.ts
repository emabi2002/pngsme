import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/types'

export async function getProducts({
  limit = 12,
  offset = 0,
  category,
  search,
  business_id,
  featured,
}: {
  limit?: number
  offset?: number
  category?: string
  search?: string
  business_id?: string
  featured?: boolean
} = {}) {
  const supabase = await createServerClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      business:businesses(*),
      category:categories(*),
      images:product_images(*)
    `)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq('category_id', category)
  }

  if (business_id) {
    query = query.eq('business_id', business_id)
  }

  if (featured) {
    query = query.eq('featured', true)
  }

  if (search) {
    query = query.textSearch('name', search, {
      type: 'websearch',
      config: 'english',
    })
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as Product[]
}

export async function getProductBySlug(slug: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      business:businesses(*),
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  // Increment view count
  await supabase
    .from('products')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', data.id)

  return data as Product
}

export async function getFeaturedProducts(limit = 4) {
  return getProducts({ limit, featured: true })
}

export async function searchProducts(query: string, limit = 20) {
  return getProducts({ search: query, limit })
}

// Client-side function for updating product views
export function incrementProductView(productId: string) {
  const supabase = createBrowserClient()

  return supabase.rpc('increment_product_view', { product_id: productId })
}
