// Off Menu revision/review system — Supabase connection.
//
// The anon key is a PUBLIC key (safe to commit); all access is gated by the
// row-level-security policies on the offmenu_review_comments table, which only
// allow rows where project = 'off-menu'. Fill these two values in from your
// Supabase project: Settings → API → Project URL + anon/public key.
export const REVIEW_CONFIG = {
  supabaseUrl: 'https://kirmozciaosdbmndomhn.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpcm1vemNpYW9zZGJtbmRvbWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMDQ3NDksImV4cCI6MjA5ODU4MDc0OX0.cnTG0J6LyCii3gOvnCcc3j7e1EXa80yJxifkpw4h3LU',
  project: 'off-menu',
  table: 'offmenu_review_comments',
}
