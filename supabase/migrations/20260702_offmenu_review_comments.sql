-- Off Menu revision/review system — run once in the Supabase SQL editor.
-- Mirrors the Arc88 schema; anon access is gated by RLS to project = 'off-menu'.
create table if not exists offmenu_review_comments (
  id text primary key,
  project text not null,
  page text not null,
  path text not null,
  review_id text not null,
  selector text not null,
  text_quote text,
  comment text not null,
  status text not null default 'open',
  viewport jsonb,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists offmenu_review_comments_proj_created_idx
  on offmenu_review_comments (project, created_at desc);
create index if not exists offmenu_review_comments_proj_reviewid_idx
  on offmenu_review_comments (project, review_id);

alter table offmenu_review_comments enable row level security;

drop policy if exists "Off Menu review reads" on offmenu_review_comments;
create policy "Off Menu review reads"
  on offmenu_review_comments for select to anon
  using (project = 'off-menu');

drop policy if exists "Off Menu review inserts" on offmenu_review_comments;
create policy "Off Menu review inserts"
  on offmenu_review_comments for insert to anon
  with check (project = 'off-menu');

drop policy if exists "Off Menu review updates" on offmenu_review_comments;
create policy "Off Menu review updates"
  on offmenu_review_comments for update to anon
  using (project = 'off-menu')
  with check (project = 'off-menu');
