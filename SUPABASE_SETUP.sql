-- Run this in the Supabase SQL Editor (https://app.supabase.com → SQL Editor)

create table if not exists email_events (
  id          bigserial primary key,
  email       text not null,
  campaign_id text not null,
  opened_at   timestamptz not null default now(),
  user_agent  text,
  created_at  timestamptz not null default now()
);

-- Index for fast lookups by campaign
create index if not exists idx_email_events_campaign on email_events(campaign_id);

-- Index for dedup check in track-open function
create index if not exists idx_email_events_email_campaign on email_events(email, campaign_id);

-- Allow the service key to insert and read (default in Supabase, but explicit is safer)
alter table email_events enable row level security;

create policy "Service key full access"
  on email_events
  using (true)
  with check (true);
