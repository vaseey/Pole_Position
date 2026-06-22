import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tozzhpyvromigzhtzlvc.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_OWMwYsFYevtPsi4uN-f9aA_SEXvWBin'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
