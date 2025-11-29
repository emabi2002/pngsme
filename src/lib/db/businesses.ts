import { createClient } from '@/lib/supabase/server'
import type { Business } from '@/lib/types'

export async function getBusinesses({
  limit = 12,
  offset = 0,
  sector,
  province,
  verified,
}: {
  limit?: number
  offset?: number
  sector?: string
  province?: string
  verified?: boolean
} = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('businesses')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (sector) {
    query = query.contains('sector', [sector])
  }

  if (province) {
    query = query.eq('province', province)
  }

  if (verified !== undefined) {
    query = query.eq('verified', verified)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching businesses:', error)
    return []
  }

  return data as Business[]
}

export async function getBusinessBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()

  if (error) {
    console.error('Error fetching business:', error)
    return null
  }

  return data as Business
}

export async function getBusinessById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching business:', error)
    return null
  }

  return data as Business
}

export async function getVerifiedBusinesses(limit = 10) {
  return getBusinesses({ limit, verified: true })
}

export async function searchBusinesses(query: string, limit = 20) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('status', 'approved')
    .textSearch('name', query, {
      type: 'websearch',
      config: 'english',
    })
    .limit(limit)

  if (error) {
    console.error('Error searching businesses:', error)
    return []
  }

  return data as Business[]
}
