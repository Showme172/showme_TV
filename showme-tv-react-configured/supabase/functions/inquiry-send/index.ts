// ============================================================
//  Showme TV — inquiry-send
//  Supabase Edge Function — علنية
//  رسالة إضافية من الزائر بنفس المحادثة — بتترسل كـ"رد" بتيليجرام
//  على آخر رسالة، حتى تضل كل محادثة مجمّعة مع بعض
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BOT_TOKEN     = Deno.env.get("INQUIRY_BOT_TOKEN")!;
const CHAT_ID       = Deno.env.get("INQUIRY_CHAT_ID")!;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  let body: { conversation_id?: string; message?: string };
  try { body = await req.json(); } catch { return json({ error: "طلب غير صالح" }, 400); }

  const { conversation_id, message } = body;
  if (!conversation_id || !message?.trim()) return json({ error: "بيانات ناقصة" }, 400);

  const db = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: conv } = await db
    .from("inquiry_conversations").select("id, visitor_name").eq("id", conversation_id).maybeSingle();
  if (!conv) return json({ error: "المحادثة غير موجودة" }, 404);

  const { data: lastMsg } = await db
    .from("inquiry_messages")
    .select("telegram_message_id")
    .eq("conversation_id", conversation_id)
    .not("telegram_message_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let tgMessageId: number | null = null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message.trim(),
        ...(lastMsg?.telegram_message_id ? { reply_to_message_id: lastMsg.telegram_message_id } : {}),
      }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.description || "تيليجرام رفض الرسالة");
    tgMessageId = data.result.message_id;
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }

  await db.from("inquiry_messages").insert({
    conversation_id, sender: "visitor", body: message.trim(), telegram_message_id: tgMessageId,
  });
  await db.from("inquiry_conversations").update({ last_message_at: new Date().toISOString() }).eq("id", conversation_id);

  return json({ ok: true });
});
