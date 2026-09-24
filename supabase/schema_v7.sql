-- =========================================================================
-- Showme TV - Add app platform grouping
-- Run this file after schema_v6.sql in the Supabase SQL Editor.
-- Existing apps are assigned to Android by default.
-- =========================================================================

alter table public.apps add column if not exists platform text not null default 'android';