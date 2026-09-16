-- 데일리 플래너: 사용자별 데이터 저장 테이블
create table if not exists public.planner_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{"categories":[],"todos":[],"routines":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.planner_data enable row level security;

drop policy if exists "Users can read their own planner data" on public.planner_data;
create policy "Users can read their own planner data"
on public.planner_data for select
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own planner data" on public.planner_data;
create policy "Users can insert their own planner data"
on public.planner_data for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own planner data" on public.planner_data;
create policy "Users can update their own planner data"
on public.planner_data for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
