-- =========================================================================
-- Showme TV — إضافات المرحلة الثانية
-- شغّل هاد الملف بعد schema.sql (نفس الطريقة: SQL Editor → الصق → Run)
-- =========================================================================

-- ---------- تطوير جدول الموظفين ----------
alter table public.profiles add column if not exists agent_no int;
alter table public.profiles add column if not exists role text not null default 'agent'; -- 'owner' أو 'agent'

-- رقم موظف عشوائي وفريد بين 1000-1999
create or replace function public.generate_agent_no()
returns int language plpgsql as $$
declare
  new_no int;
  tries int := 0;
begin
  loop
    new_no := 1000 + floor(random() * 1000)::int;
    exit when not exists (select 1 from public.profiles where agent_no = new_no);
    tries := tries + 1;
    if tries > 50 then
      raise exception 'ما قدرنا نلاقي رقم فاضي، جرب مرة تانية';
    end if;
  end loop;
  return new_no;
end;
$$;

create or replace function public.set_agent_no()
returns trigger language plpgsql as $$
begin
  if new.agent_no is null then
    new.agent_no := public.generate_agent_no();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_agent_no on public.profiles;
create trigger trg_set_agent_no
  before insert on public.profiles
  for each row execute function public.set_agent_no();


-- ---------- حضور الموظفين (Online / Offline) ----------
create table if not exists public.agent_presence (
  agent_id uuid primary key references public.profiles(id) on delete cascade,
  last_seen timestamptz not null default now()
);
alter table public.agent_presence enable row level security;

create policy "authenticated can upsert own presence"
  on public.agent_presence for insert to authenticated with check (auth.uid() = agent_id);
create policy "authenticated can update own presence"
  on public.agent_presence for update to authenticated using (auth.uid() = agent_id);
create policy "anyone can read presence"
  on public.agent_presence for select to anon, authenticated using (true);


-- ---------- محادثات اللايف تشات (ثنائية الاتجاه) ----------
create table if not exists public.conversations (
  id bigint generated always as identity primary key,
  customer_name text,
  customer_email text,
  status text not null default 'open',
  assigned_agent_no int,
  created_at timestamptz not null default now()
);
alter table public.conversations enable row level security;

create policy "anyone can create conversation"
  on public.conversations for insert to anon, authenticated with check (true);
create policy "anyone can read own conversation"
  on public.conversations for select to anon, authenticated using (true);
create policy "authenticated can update conversation"
  on public.conversations for update to authenticated using (true);

create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  conversation_id bigint not null references public.conversations(id) on delete cascade,
  sender text not null, -- 'customer' أو 'agent'
  body text not null,
  created_at timestamptz not null default now()
);
alter table public.chat_messages enable row level security;

create policy "anyone can insert chat message"
  on public.chat_messages for insert to anon, authenticated with check (true);
create policy "anyone can read chat messages"
  on public.chat_messages for select to anon, authenticated using (true);


-- ---------- آراء الزبائن (لقطات شاشة) ----------
create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;

create policy "anyone can read reviews"
  on public.reviews for select to anon, authenticated using (true);
create policy "authenticated can manage reviews"
  on public.reviews for all to authenticated using (true) with check (true);

-- Storage bucket لصور آراء الزبائن (شغّل هاد الجزء لو ظهر خطأ "bucket already exists" تجاهله)
insert into storage.buckets (id, name, public)
values ('reviews', 'reviews', true)
on conflict (id) do nothing;

create policy "public can view review images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'reviews');
create policy "authenticated can upload review images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'reviews');
create policy "authenticated can delete review images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'reviews');


-- ---------- تطبيقات التحميل (Downloads) ----------
create table if not exists public.apps (
  id bigint generated always as identity primary key,
  name text not null,
  version text,
  icon_url text,
  download_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.apps enable row level security;

create policy "anyone can read apps"
  on public.apps for select to anon, authenticated using (true);
create policy "authenticated can manage apps"
  on public.apps for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('apps', 'apps', true)
on conflict (id) do nothing;

create policy "public can view app icons"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'apps');
create policy "authenticated can upload app icons"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'apps');


-- ---------- تفعيل Realtime على الجداول الجديدة ----------
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.agent_presence;
alter publication supabase_realtime add table public.reviews;
alter publication supabase_realtime add table public.apps;


-- ---------- ربط تيليجرام كقناة واردة بصندوق الرسائل ----------
alter table public.messages add column if not exists external_id text;

-- ---------- تحديث صلاحيات جدول الموظفين: كل موظف يشوف نفسه بس، المالك يشوف الكل ----------
create or replace function public.is_owner()
returns boolean language sql security definer stable as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'owner');
$$;

drop policy if exists "authenticated can read profiles" on public.profiles;

create policy "owner can read all profiles"
  on public.profiles for select to authenticated
  using (public.is_owner());

create policy "self can read own profile"
  on public.profiles for select to authenticated
  using (id = auth.uid());


-- ---------- إنشاء صف بجدول profiles تلقائياً لأي مستخدم جديد ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_handle_new_user on auth.users;
create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ---------- خلي أول مستخدم عملته owner تلقائياً ----------
-- بدّل الإيميل بإيميلك الحقيقي وشغّل هاد السطر لحاله بعد كل شي فوق
-- update public.profiles set role = 'owner', display_name = 'المالك'
-- where id = (select id from auth.users where email = 'showmetv@gmail.com');
