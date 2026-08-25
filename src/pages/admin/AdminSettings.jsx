import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useConfig } from '../../context/ConfigContext';
import { COPY_GROUPS } from './copyFieldsMap';

export default function AdminSettings() {
  const liveConfig = useConfig();
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(liveConfig)));
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  function updateCopy(key, value) {
    setForm({ ...form, copy: { ...form.copy, [key]: value } });
  }

  function updateMessage(key, value) {
    setForm({ ...form, messages: { ...form.messages, [key]: value } });
  }

  function updatePlan(i, key, value) {
    const plans = [...form.plans];
    plans[i] = { ...plans[i], [key]: value };
    setForm({ ...form, plans });
  }

  function updateFeature(i, key, value) {
    const features = [...form.features];
    features[i] = { ...features[i], [key]: value };
    setForm({ ...form, features });
  }

  function updateCategory(i, key, value) {
    const channelCategories = [...form.channelCategories];
    channelCategories[i] = { ...channelCategories[i], [key]: value };
    setForm({ ...form, channelCategories });
  }

  function updateFaq(i, key, value) {
    const faq = [...form.faq];
    faq[i] = { ...faq[i], [key]: value };
    setForm({ ...form, faq });
  }

  function updateTrustBadge(i, key, value) {
    const trustBadges = [...form.trustBadges];
    trustBadges[i] = { ...trustBadges[i], [key]: value };
    setForm({ ...form, trustBadges });
  }

  function addItem(listKey, blankItem) {
    setForm({ ...form, [listKey]: [...form[listKey], blankItem] });
  }

  function removeItem(listKey, index) {
    setForm({ ...form, [listKey]: form[listKey].filter((_, i) => i !== index) });
  }

  async function handleSave() {
    setSaving(true);
    setSavedMsg('');
    const { error } = await supabase.from('site_settings').upsert({ id: 1, data: form });
    setSaving(false);
    if (error) {
      setSavedMsg('⚠️ صار خطأ، جرّب مرة تانية.');
    } else {
      setSavedMsg('✅ تم الحفظ — الموقع اتحدث الآن لكل الزوار.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div>
      {/* ---------- طرق التواصل ---------- */}
      <div className="admin-section">
        <h2>طرق التواصل</h2>
        <div className="row2">
          <div className="field">
            <label>يوزر تيليجرام (بدون @)</label>
            <input value={form.telegramUsername} onChange={(e) => setForm({ ...form, telegramUsername: e.target.value })} />
          </div>
          <div className="field">
            <label>رقم واتساب</label>
            <input value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} />
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label>رابط فيسبوك</label>
            <input value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} />
          </div>
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          </div>
        </div>
      </div>

      {/* ---------- الرسائل الجاهزة (تيليجرام/واتساب) ---------- */}
      <div className="admin-section">
        <h2>الرسائل الجاهزة بالأزرار</h2>
        <p className="hint">النص يلي بيصل جاهز لتيليجرام أو واتساب لما حدا يضغط أزرار "جرّب مجاناً" أو "فعّل الآن" أو "اشترك الآن" بأي مكان بالموقع.</p>
        <div className="field">
          <label>رسالة "جرّب مجاناً"</label>
          <textarea value={form.messages.trial} onChange={(e) => updateMessage('trial', e.target.value)} />
        </div>
        <div className="field">
          <label>رسالة "فعّل الآن" (عام)</label>
          <textarea value={form.messages.activate} onChange={(e) => updateMessage('activate', e.target.value)} />
        </div>
        <div className="field">
          <label>رسالة "اشترك الآن" (بالهيرو)</label>
          <textarea value={form.messages.subscribe} onChange={(e) => updateMessage('subscribe', e.target.value)} />
        </div>
      </div>

      {/* ---------- نصوص كل صفحة ---------- */}
      {COPY_GROUPS.map((group) => (
        <div className="admin-section" key={group.title}>
          <h2>{group.title}</h2>
          {group.fields.map((f) => (
            <div className="field" key={f.key}>
              <label>{f.label}</label>
              {f.long ? (
                <textarea value={form.copy[f.key] || ''} onChange={(e) => updateCopy(f.key, e.target.value)} />
              ) : (
                <input value={form.copy[f.key] || ''} onChange={(e) => updateCopy(f.key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
      ))}

      {/* ---------- شارات الثقة ---------- */}
      <div className="admin-section">
        <h2>شارات الثقة (تحت أزرار الهيرو)</h2>
        {form.trustBadges.map((b, i) => (
          <div className="feature-block" key={i}>
            <div className="block-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>شارة {i + 1}</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => removeItem('trustBadges', i)}>🗑 حذف</button>
            </div>
            <div className="field"><label>النص</label><input value={b.label} onChange={(e) => updateTrustBadge(i, 'label', e.target.value)} /></div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => addItem('trustBadges', { icon: 'shield', label: 'شارة جديدة' })}
        >
          ➕ إضافة شارة جديدة
        </button>
      </div>

      {/* ---------- خطط الأسعار ---------- */}
      <div className="admin-section">
        <h2>خطط الأسعار</h2>
        {form.plans.map((p, i) => (
          <div className="plan-block" key={i}>
            <div className="block-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>خطة: {p.name}</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => removeItem('plans', i)}>🗑 حذف الخطة</button>
            </div>
            <div className="field"><label>اسم الخطة</label><input value={p.name} onChange={(e) => updatePlan(i, 'name', e.target.value)} /></div>
            <div className="row3">
              <div className="field"><label>السعر</label><input value={p.price} onChange={(e) => updatePlan(i, 'price', e.target.value)} /></div>
              <div className="field"><label>المدة</label><input value={p.period} onChange={(e) => updatePlan(i, 'period', e.target.value)} /></div>
              <div className="field"><label>الوسم (Badge)</label><input value={p.badge || ''} onChange={(e) => updatePlan(i, 'badge', e.target.value || null)} /></div>
            </div>
            <div className="field"><label>وصف السعر الفرعي</label><input value={p.sub} onChange={(e) => updatePlan(i, 'sub', e.target.value)} /></div>
            <div className="field"><label>ميزة إضافية (Perk)</label><input value={p.perk || ''} onChange={(e) => updatePlan(i, 'perk', e.target.value || null)} /></div>
            <div className="field"><label>رسالة تيليجرام/واتساب الخاصة بهاي الخطة</label><textarea value={p.telegramMessage} onChange={(e) => updatePlan(i, 'telegramMessage', e.target.value)} /></div>
            <label className="field-check">
              <input type="checkbox" checked={p.featured} onChange={(e) => updatePlan(i, 'featured', e.target.checked)} />
              إبراز هاي الخطة بصرياً افتراضياً
            </label>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => addItem('plans', {
            name: 'خطة جديدة', price: '€0', period: '/ شهر', sub: '', perk: null,
            features: ['أكثر من 15,000 قناة مباشرة', 'مكتبة أفلام ومسلسلات كاملة (+200,000)'],
            featured: false, badge: null, telegramMessage: 'مرحباً، أرغب بالاشتراك من Showme TV'
          })}
        >
          ➕ إضافة خطة جديدة
        </button>
      </div>

      {/* ---------- المزايا ---------- */}
      <div className="admin-section">
        <h2>المزايا</h2>
        {form.features.map((f, i) => (
          <div className="feature-block" key={i}>
            <div className="block-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>ميزة {i + 1}</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => removeItem('features', i)}>🗑 حذف</button>
            </div>
            <div className="field"><label>العنوان</label><input value={f.title} onChange={(e) => updateFeature(i, 'title', e.target.value)} /></div>
            <div className="field"><label>الوصف</label><textarea value={f.desc} onChange={(e) => updateFeature(i, 'desc', e.target.value)} /></div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => addItem('features', { icon: 'bolt', title: 'ميزة جديدة', desc: 'وصف الميزة هون.' })}
        >
          ➕ إضافة ميزة جديدة
        </button>
      </div>

      {/* ---------- فئات القنوات ---------- */}
      <div className="admin-section">
        <h2>فئات القنوات</h2>
        {form.channelCategories.map((cat, i) => (
          <div className="feature-block" key={i}>
            <div className="block-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>فئة {i + 1}</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => removeItem('channelCategories', i)}>🗑 حذف</button>
            </div>
            <div className="row2">
              <div className="field"><label>الاسم</label><input value={cat.name} onChange={(e) => updateCategory(i, 'name', e.target.value)} /></div>
              <div className="field"><label>العدد التقريبي</label><input value={cat.count} onChange={(e) => updateCategory(i, 'count', e.target.value)} /></div>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => addItem('channelCategories', { icon: 'globe', name: 'فئة جديدة', count: 'تغطية كاملة' })}
        >
          ➕ إضافة فئة جديدة
        </button>
      </div>

      {/* ---------- الأسئلة الشائعة ---------- */}
      <div className="admin-section">
        <h2>الأسئلة الشائعة</h2>
        {form.faq.map((item, i) => (
          <div className="feature-block" key={i}>
            <div className="block-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>سؤال {i + 1}</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => removeItem('faq', i)}>🗑 حذف</button>
            </div>
            <div className="field"><label>السؤال</label><input value={item.q} onChange={(e) => updateFaq(i, 'q', e.target.value)} /></div>
            <div className="field"><label>الجواب</label><textarea value={item.a} onChange={(e) => updateFaq(i, 'a', e.target.value)} /></div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => addItem('faq', { q: 'سؤال جديد؟', a: 'الجواب هون.' })}
        >
          ➕ إضافة سؤال جديد
        </button>
      </div>

      <div className="sticky-bar">
        <p>{savedMsg || 'التعديلات بتنعكس فوراً لكل زوار الموقع بعد الحفظ.'}</p>
        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : '💾 حفظ ونشر التعديلات'}
        </button>
      </div>
    </div>
  );
}
