// Supabase Edge Function: telegram-reply
// بيسمح للموظف يرد على رسالة تيليجرام من داخل لوحة الأدمن
//
// النشر: supabase functions deploy telegram-reply
// (بتحتاج نفس TELEGRAM_BOT_TOKEN يلي ضبطته لدالة telegram-webhook)

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

serve(async (req) => {
  try {
    const { chat_id, text } = await req.json();
    if (!chat_id || !text) {
      return new Response(JSON.stringify({ error: "بيانات ناقصة" }), { status: 400 });
    }

    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text }),
    });

    const data = await res.json();
    if (!data.ok) {
      return new Response(JSON.stringify({ error: data.description }), { status: 400 });
    }

    return new Response(JSON.stringify({ ok: true }));
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
