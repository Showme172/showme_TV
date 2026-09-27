-- =========================================================================
-- Showme TV — إضافة كود Downloader للتطبيقات (المرحلة 5)
-- شغّل هاد الملف بـ SQL Editor بعد schema_v2.sql
-- =========================================================================

alter table public.apps add column if not exists downloader_code text;
