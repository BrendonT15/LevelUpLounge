import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bcpluftwbsbbfaczxoeb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcGx1ZnR3YnNiYmZhY3p4b2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3OTI2NDcsImV4cCI6MjA0NzM2ODY0N30.zvP_73vAFO0I-sOFuRomajcyArRrkQ6D14GEgn7rJMc'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase;