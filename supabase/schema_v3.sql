-- =========================================================================
-- Showme TV — نتائج المباريات المباشرة (المرحلة 3)
-- شغّل هاد الملف بـ SQL Editor بعد schema.sql و schema_v2.sql
-- =========================================================================

-- صف واحد بس (id=1) بيخزن آخر نسخة من المباريات المباشرة
create table if not exists public.live_scores (
  id int primary key default 1,
  data jsonb not null default '[]'::jsonb,
  is_live boolean not null default false,
  last_checked_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.live_scores (id, data, is_live)
values (1, '[]'::jsonb, false)
on conflict (id) do nothing;

alter table public.live_scores enable row level security;

-- الكل يقدر يقرأ (عشان الموقع يعرضها لكل زائر)
create policy "anyone can read live scores"
  on public.live_scores for select
  to anon, authenticated
  using (true);

-- الكتابة بس عن طريق الـ Edge Function (بيستخدم service role وبيتجاوز RLS تلقائياً)

alter publication supabase_realtime add table public.live_scores;


-- =========================================================================
-- تفعيل الفحص التلقائي كل 5 دقائق (Cron)
-- =========================================================================
-- الخطوة الأولى (مرة وحدة بس، من الواجهة):
--   Database → Extensions → فعّل pg_cron و pg_net
--
-- بعدها شغّل هاد الأمر (بدّل PROJECT_REF و CRON_SECRET بالقيم الحقيقية تبعتك،
-- CRON_SECRET اختارها إنت بنفسك — أي نص عشوائي، وحطها بنفس القيمة لما
-- تعمل supabase secrets set CRON_SECRET=... بالخطوة يلي بالـ README):

-- select cron.schedule(
--   'update-live-scores',
--   '*/5 * * * *',
--   $$
--   select net.http_post(
--     url := 'https://PROJECT_REF.supabase.co/functions/v1/update-scores',
--     headers := jsonb_build_object('x-cron-secret', 'CRON_SECRET'),
--     body := '{}'::jsonb
--   );
--   $$
-- );
