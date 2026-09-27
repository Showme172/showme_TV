-- =========================================================================
-- Showme TV — إعداد قاعدة بيانات Supabase
-- الصق هاد الملف كامل بـ SQL Editor داخل مشروع Supabase تبعك واضغط Run
-- =========================================================================

-- جدول الرسائل (صندوق الأدمن الموحّد)
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  channel text not null default 'website_form',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- أي حدا (حتى زوار الموقع) يقدر يضيف رسالة جديدة (إرسال الفورم)
create policy "anyone can insert messages"
  on public.messages for insert
  to anon
  with check (true);

-- بس المستخدمين المسجّلين (الموظفين) يقدروا يشوفوا/يعدّلوا الرسائل
create policy "authenticated can read messages"
  on public.messages for select
  to authenticated
  using (true);

create policy "authenticated can update messages"
  on public.messages for update
  to authenticated
  using (true);


-- جدول إعدادات الموقع (الأسعار / المزايا / التواصل) — صف واحد بس id=1
create table if not exists public.site_settings (
  id int primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- الكل يقدر يقرأ الإعدادات (عشان الموقع يعرضها لكل زائر)
create policy "anyone can read settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

-- بس المستخدمين المسجّلين (الأدمن) يقدروا يعدّلوا
create policy "authenticated can upsert settings"
  on public.site_settings for insert
  to authenticated
  with check (true);

create policy "authenticated can update settings"
  on public.site_settings for update
  to authenticated
  using (true);


-- جدول الموظفين (Agents) — بيتربط تلقائياً بأي حساب جديد ينعمل
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  agent_no bigint generated always as identity,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "authenticated can read profiles"
  on public.profiles for select
  to authenticated
  using (true);


-- تفعيل التحديث الفوري (Realtime) على الجدولين المهمين
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.site_settings;
