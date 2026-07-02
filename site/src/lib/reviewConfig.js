// Off Menu revision/review system — Supabase connection.
//
// The anon key is a PUBLIC key (safe to commit); all access is gated by the
// row-level-security policies on the offmenu_review_comments table, which only
// allow rows where project = 'off-menu'. Fill these two values in from your
// Supabase project: Settings → API → Project URL + anon/public key.
export const REVIEW_CONFIG = {
  supabaseUrl: '',        // e.g. https://xxxxxxxx.supabase.co
  supabaseAnonKey: '',    // anon / public key
  project: 'off-menu',
  table: 'offmenu_review_comments',
}
