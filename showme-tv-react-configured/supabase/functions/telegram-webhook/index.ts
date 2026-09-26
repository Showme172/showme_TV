// Supabase Edge Function: telegram-webhook
// بيستقبل رسائل بوت تيليجرام وبيخزنها بصندوق الأدمن (جدول messages)
//
// خطوات التفعيل (بدون ما تشاركني توكن البوت):
// 1. اعمل بوت جديد عبر @BotFather بتيليجرام (أمر /newbot)، بياخد دقيقتين ومجاني.
// 2. من جهازك: supabase secrets set TELEGRAM_BOT_TOKEN=التوكن_يلي_عطاك_ياه_BotFather
// 3. انشر الدالة: supabase functions deploy telegram-webhook --no-verify-jwt
// 4. سجّل الرابط عند تيليجرام (بدّل TOKEN و PROJECT_REF):
//    https://api.telegram.org/botTOKEN/setWebhook?url=https://PROJECT_REF.supabase.co/functions/v1/telegram-webhook

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const update = await req.json();
    const msg = update.message;
    if (!msg || !msg.text) {
      return new Response("ok"); // نتجاهل أي تحديث مو رسالة نصية
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    const name = [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(" ") || msg.from?.username || "مستخدم تيليجرام";

    await supabaseAdmin.from("messages").insert({
      name,
      email: msg.from?.username ? `@${msg.from.username}` : "بدون يوزر",
      message: msg.text,
      channel: "telegram",
      status: "open",
      external_id: String(msg.chat.id),
    });

    return new Response("ok");
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
});
