// src/lib/supabase/server.ts
import {
  createServerComponentClient,
  SupabaseClient,
} from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { cache } from 'react'

// Tạo hàm cache để tránh tạo nhiều client trong cùng một request
export const createClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}) as () => SupabaseClient
