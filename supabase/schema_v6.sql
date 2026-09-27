-- =========================================================================
-- Showme TV - Add YouTube tutorial links to download apps
-- Run this file after schema_v5.sql in the Supabase SQL Editor.
-- =========================================================================

alter table public.apps add column if not exists tutorial_url text;