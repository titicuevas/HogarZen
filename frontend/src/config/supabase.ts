import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fojbinwlwomvivkplwlv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvamJpbndsd29tdml2a3Bsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNTYwNzQsImV4cCI6MjA2NzYzMjA3NH0.vvK1cE8HBwPZo-PT_ElrH1MNpOmHP2l1Q1DTHsoi12c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 