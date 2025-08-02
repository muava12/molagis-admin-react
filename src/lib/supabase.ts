import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Customer {
  id: number
  nama: string
  alamat?: string
  telepon?: string
  telepon_alt?: string
  telepon_pemesan?: string
  maps?: string
  ongkir?: number
  date_created?: string
  notion_id?: string
}

export interface CustomerInsert {
  nama: string
  alamat?: string
  telepon?: string
  telepon_alt?: string
  telepon_pemesan?: string
  maps?: string
  ongkir?: number
}

export interface CustomerUpdate {
  nama?: string
  alamat?: string
  telepon?: string
  telepon_alt?: string
  telepon_pemesan?: string
  maps?: string
  ongkir?: number
}