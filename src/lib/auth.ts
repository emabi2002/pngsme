import { createClient } from '@/lib/supabase/server'
import type { User } from '@/lib/types'

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Fetch user profile from our users table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function getUserSession() {
  const supabase = await createClient()

  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    return null
  }

  return session
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
