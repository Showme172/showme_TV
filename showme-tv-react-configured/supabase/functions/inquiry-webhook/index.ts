// ============================================================
//  Showme TV — inquiry-webhook
//  Supabase Edge Function — Telegram بينادي هاي مباشرة
//  لما ترد (Reply) على رسالة زائر، هاي بتلاقي محادثته وتضيف ردك فيها
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s });

Deno.serve(async (req) => {
  let update: any;
  try { update = await req.json(); } catch { return new Response("ok"); }

  const msg = update.message;
  if (!msg?.text || !msg.reply_to_message) {
    // مو رد على رسالة — نتجاهله (Telegram لازم يوصله إشعار 200 مهما كان)
    return new Response("ok");
  }

  const repliedToId = msg.reply_to_message.message_id;
  const db = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: original } = await db
    .from("inquiry_messages")
    .select("conversation_id")
    .eq("telegram_message_id", repliedToId)
    .maybeSingle();

  if (!original) return new Response("ok"); // رد على رسالة مش من هاد النظام

  await db.from("inquiry_messages").insert({
    conversation_id: original.conversation_id,
    sender: "agent",
    body: msg.text,
  });
  await db.from("inquiry_conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", original.conversation_id);

  return new Response("ok");
});
