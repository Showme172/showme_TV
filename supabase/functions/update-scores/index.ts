// Supabase Edge Function: update-scores
// بيفحص إذا في مباريات مباشرة، وبيخزن النتيجة بجدول live_scores.
// مصمّم يستهلك أقل عدد ممكن من الطلبات على الـ API المجاني:
//   - وقت الخمول (ما في مباراة معروفة): بيسأل الـ API فعلياً بس 3 مرات بالساعة تقريباً (~72 طلب/يوم).
//   - وقت وجود مباراة مباشرة معروفة: بيسأل الـ API بكل تشغيلة (كل 5 دقايق) لتحديث النتيجة بسرعة.
//
// خطوات النشر: راجع README.md قسم "نتائج المباريات المباشرة"

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// اختياري: حط أرقام الدوريات يلي يهمّوك بس (خليها فاضية [] لعرض كل المباريات المباشرة بالعالم).
// تلاقي أرقام الدوريات (League ID) من توثيق API-Football: https://www.api-football.com/documentation-v3
const LEAGUE_WHITELIST: number[] = [];

serve(async (req) => {
  try {
    const cronSecret = req.headers.get("x-cron-secret");
    if (cronSecret !== Deno.env.get("CRON_SECRET")) {
      return new Response("unauthorized", { status: 401 });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: current } = await supabaseAdmin
      .from("live_scores")
      .select("*")
      .eq("id", 1)
      .single();

    const isCurrentlyLiveKnown = current?.is_live === true;
    const minute = new Date().getUTCMinutes();
    const scheduledCheck = minute % 25 < 5; // بيلمس تقريباً 3 مرات بالساعة وقت الخمول

    const shouldCheck = isCurrentlyLiveKnown || scheduledCheck;

    if (!shouldCheck) {
      return new Response(JSON.stringify({ skipped: true, reason: "idle-throttle" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("SPORTS_API_KEY");
    const res = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
      headers: { "x-apisports-key": apiKey! },
    });
    const json = await res.json();

    let fixtures = json.response || [];
    if (LEAGUE_WHITELIST.length > 0) {
      fixtures = fixtures.filter((f: any) => LEAGUE_WHITELIST.includes(f.league.id));
    }

    const simplified = fixtures.map((f: any) => ({
      league: f.league.name,
      leagueLogo: f.league.logo,
      home: f.teams.home.name,
      homeLogo: f.teams.home.logo,
      away: f.teams.away.name,
      awayLogo: f.teams.away.logo,
      homeScore: f.goals.home,
      awayScore: f.goals.away,
      minute: f.fixture.status.elapsed,
      status: f.fixture.status.short,
    }));

    await supabaseAdmin.from("live_scores").upsert({
      id: 1,
      data: simplified,
      is_live: simplified.length > 0,
      last_checked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ ok: true, count: simplified.length, apiStatus: json.errors || null }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
