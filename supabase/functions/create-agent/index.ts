// Supabase Edge Function: create-agent
// بينشئ حساب موظف جديد بأمان (بدون كشف الـ service role key بالمتصفح)
//
// طريقة النشر (من جهازك، بعد تثبيت Supabase CLI):
//   supabase functions deploy create-agent
//
// ملاحظة: هاد الملف بيشتغل على سيرفرات Supabase نفسها، مو بالمتصفح،
// فآمن نحط فيه الـ service role key عن طريق متغيرات البيئة تبعت Supabase.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: "بيانات ناقصة" }), { status: 400 });
    }

    const safeRole = role === "owner" ? "owner" : "agent";

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), { status: 400 });
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({ id: userData.user.id, display_name: name, role: safeRole });

    if (profileError) {
      return new Response(JSON.stringify({ error: profileError.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
