-- شغّليه مرة وحدة بمشروع اللوحة (نفس مشروع customers/payment_links)

create table public.inquiry_conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_name text not null,
  contact_method text,
  contact_value text,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table public.inquiry_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.inquiry_conversations(id) on delete cascade,
  sender text not null,              -- 'visitor' | 'agent'
  body text not null,
  telegram_message_id bigint,        -- رقم رسالة تيليجرام المرتبطة (لتتبع الردود)
  created_at timestamptz not null default now()
);

alter table public.inquiry_conversations enable row level security;
alter table public.inquiry_messages enable row level security;
-- ما في سياسات SELECT مفتوحة — كل الوصول عبر Edge Functions بمفتاح service role بس.
-- الموقع بيشوف رسائل محادثته فقط عن طريق Realtime subscription على القناة، مش عن طريق REST مباشر.

create index inquiry_messages_conv_idx on public.inquiry_messages (conversation_id, created_at);
create index inquiry_messages_tg_idx on public.inquiry_messages (telegram_message_id);

-- ملاحظة: ما استخدمنا Realtime هون قصداً (كان بده سياسة SELECT مفتوحة على الجدول،
-- وهاد بيخلي أي حدا يقدر يشوف كل المحادثات مش بس محادثته). بدالها الموقع بيسأل
-- (poll) كل كم ثانية عن طريق فنكشن مخصصة، فتضل البيانات كلها خلف service role بس.
