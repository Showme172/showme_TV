// ============================================================
//  Showme TV — inquiry-start
//  Supabase Edge Function — علنية
//  بتبدأ محادثة جديدة وترسل أول رسالة للبوت المخصص
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

const METHOD_LABEL: Record<string, string> = {
  phone: "📱 رقم هاتف", email: "📧 إيميل", telegram: "✈️ يوزر تيليجرام",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  let body: { name?: string; contact_method?: string; contact_value?: string; message?: string };
  try { body = await req.json(); } catch { return json({ error: "طلب غير صالح" }, 400); }

  const { name, contact_method, contact_value, message } = body;
  if (!name?.trim() || !contact_value?.trim() || !message?.trim()) {
    return json({ error: "بيانات ناقصة" }, 400);
  }

  const db = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: conv, error: convErr } = await db
    .from("inquiry_conversations")
    .insert({ visitor_name: name.trim(), contact_method, contact_value: contact_value.trim() })
    .select("id")
    .single();
  if (convErr || !conv) return json({ error: "تعذر بدء المحادثة" }, 500);

  const methodLabel = METHOD_LABEL[contact_method || ""] || "وسيلة تواصل";
  const text = [
    "💬 محادثة جديدة من الموقع",
    "",
    `👤 الاسم: ${name.trim()}`,
    `${methodLabel}: ${contact_value.trim()}`,
    "",
    message.trim(),
    "",
    "↩️ رجاءً استخدم «رد» على هاي الرسالة عشان جوابك يوصله بنفس محادثته.",
  ].join("\n");

  let tgMessageId: number | null = null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.description || "تيليجرام رفض الرسالة");
    tgMessageId = data.result.message_id;
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }

  await db.from("inquiry_messages").insert({
    conversation_id: conv.id, sender: "visitor", body: message.trim(), telegram_message_id: tgMessageId,
  });

  return json({ ok: true, conversation_id: conv.id });
});
