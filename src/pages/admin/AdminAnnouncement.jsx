import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminAnnouncement() {
  const [current, setCurrent] = useState(null);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(24);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    setCurrent(data || null);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function remainingHours(a) {
    const ageHours = (Date.now() - new Date(a.created_at).getTime()) / 3600000;
    const left = a.duration_hours - ageHours;
    return left > 0 ? left : 0;
  }

  async function publish(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setSaving(true);

    if (current) {
      await supabase.from('announcements').update({ active: false }).eq('id', current.id);
    }
    await supabase.from('announcements').insert({
      message: message.trim(),
      duration_hours: Number(duration) || 24,
      active: true,
    });

    setSaving(false);
    setMessage('');
    setStatus('✅ تم نشر الإعلان — رح يبدأ يظهر للزوار فوراً.');
    load();
  }

  async function stopNow() {
    if (!current) return;
    await supabase.from('announcements').update({ active: false }).eq('id', current.id);
    setStatus('تم إيقاف الإعلان.');
    setCurrent(null);
  }

  return (
    <div>
      <div className="admin-section">
        <h2>الإعلان الحالي</h2>
        <p className="hint">
          الرسالة بتظهر تلقائياً كنافذة منبثقة لأي زائر يفتح الموقع لأول مرة، وبتختفي وحدها بعد المدة يلي بتحددها.
          لو الزائر أغلقها بنفسه، ما رح تطلعله مرة تانية لنفس الإعلان.
        </p>

        {loading && <p className="hint">جاري التحميل...</p>}

        {!loading && current && (
          <div className="inbox-item" style={{ marginBottom: 20 }}>
            <p style={{ marginBottom: 10 }}>{current.message}</p>
            <p className="text-dim" style={{ fontSize: 13 }}>
              باقي تقريباً {remainingHours(current).toFixed(1)} ساعة من أصل {current.duration_hours}
            </p>
            <div className="inbox-item-actions">
              <button className="btn btn-outline btn-sm" onClick={stopNow}>إيقاف الآن</button>
            </div>
          </div>
        )}

        {!loading && !current && <p className="hint">ما في إعلان شغال حالياً.</p>}
      </div>

      <div className="admin-section">
        <h2>نشر إعلان جديد</h2>
        <p className="hint">نشر إعلان جديد بيوقف تلقائياً أي إعلان قديم شغال.</p>
        <form onSubmit={publish}>
          <div className="field">
            <label>نص الإعلان</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="مثلاً: خصم 20% على الاشتراك السنوي لمدة 24 ساعة فقط!"
              required
            />
          </div>
          <div className="field" style={{ maxWidth: 220 }}>
            <label>مدة الظهور (بالساعات)</label>
            <input type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'جاري النشر...' : '📢 نشر الإعلان'}
          </button>
          {status && <p className="hint" style={{ marginTop: 12 }}>{status}</p>}
        </form>
      </div>
    </div>
  );
}
