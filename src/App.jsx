-- Run in Supabase SQL Editor (Project: pvyrfjgrfmuvivdflcgg) before deploying the new App.jsx.
-- Follows the same flexible-data pattern already used by the scenes table, and the same
-- owner-only RLS pattern used everywhere else in NKÒ (USING + WITH CHECK on both, per the
-- silent-failure lesson already learned on other tables).

create table if not exists shoot_days (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references auth.users(id),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table shoot_days enable row level security;

create policy "owner full access on shoot_days"
  on shoot_days
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
