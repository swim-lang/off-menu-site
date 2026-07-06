-- Off Menu review system: team replies + client review acknowledgement.
-- Run once in the Supabase SQL editor for the "Off Menu Review" project.
-- The existing anon UPDATE policy (project = 'off-menu') already covers these.
alter table offmenu_review_comments add column if not exists reply text;
alter table offmenu_review_comments add column if not exists reply_at timestamptz;
alter table offmenu_review_comments add column if not exists reply_ack boolean not null default false;
