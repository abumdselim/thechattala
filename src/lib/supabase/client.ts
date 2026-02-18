import { createClientComponentClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export const createClient = () => {
  return createClientComponentClient<Database>()
}
