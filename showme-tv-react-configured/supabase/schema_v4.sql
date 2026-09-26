-- =========================================================================
-- Showme TV — الإعلانات المؤقتة (المرحلة 4)
-- شغّل هاد الملف بـ SQL Editor بعد schema.sql و schema_v2.sql و schema_v3.sql
-- =========================================================================

create table if not exists public.announcements (
  id bigint generated always as identity primary key,
  message text not null,
  duration_hours numeric not null default 24,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "anyone can read announcements"
  on public.announcements for select
  to anon, authenticated
  using (true);

create policy "staff can manage announcements"
  on public.announcements for all
  to authenticated
  using (true) with check (true);

alter publication supabase_realtime add table public.announcements;
