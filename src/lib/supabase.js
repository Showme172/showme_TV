import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

// إذا ما ضفت مفاتيح Supabase بعد بملف .env، الموقع بيشتغل عادي
// بس صندوق الرسائل ولوحة الأدمن الحية ما رح يشتغلوا لحد ما تضيفهم.
export const supabase = isSupabaseConfigured ? createClient(url, key) : null;
