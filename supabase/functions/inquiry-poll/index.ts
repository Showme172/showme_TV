// ============================================================
//  Showme TV — inquiry-poll
//  Supabase Edge Function — علنية
//  الموقع بينادي هاي كل كم ثانية عشان يجيب أي رسائل جديدة (خصوصاً ردودك)
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const url = new URL(req.url);
  const conversation_id = url.searchParams.get("conversation_id");
  const after = url.searchParams.get("after"); // ISO timestamp, اختياري

  if (!conversation_id) return json({ error: "معرّف المحادثة ناقص" }, 400);

  const db = createClient(SUPABASE_URL, SERVICE_KEY);
  let q = db
    .from("inquiry_messages")
    .select("id, sender, body, created_at")
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: true });

  if (after) q = q.gt("created_at", after);

  const { data, error } = await q;
  if (error) return json({ error: "تعذر الجلب" }, 500);

  return json({ ok: true, messages: data || [] });
});
