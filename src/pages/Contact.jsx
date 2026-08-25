import { useState } from 'react';
import { telegramLink } from '../config';
import { useConfig } from '../context/ConfigContext';
import { SOCIAL_ICONS } from '../components/Icons';
import { useSendMessage } from '../hooks/useSendMessage';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Contact() {
  const config = useConfig();
  const c = config.copy;
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { send, status } = useSendMessage();
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await send({ ...form, channel: 'website_form' });
    setResult(res);
  }

  return (
    <main>
      <div className="page-hero">
        <div className="wrap">
          <span className="eyebrow"><span className="dot"></span>{c.contactEyebrow}</span>
          <h1>{c.contactH1}</h1>
          <p>{c.contactIntro}</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="support-layout">
            <div className="support-info">
              <p>{c.contactInfoText}</p>
              <div className="support-channels">
                <a href={telegramLink(config.messages.trial)} target="_blank" rel="noopener noreferrer" className="support-channel">
                  <span className="ic">{SOCIAL_ICONS.telegram}</span>
                  <span><span className="lbl">تيليجرام</span><br /><span className="val">@{config.telegramUsername}</span></span>
                </a>
                {config.whatsappNumber && (
                  <a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="support-channel">
                    <span className="ic">{SOCIAL_ICONS.whatsapp}</span>
                    <span><span className="lbl">واتساب</span><br /><span className="val">تواصل مباشر</span></span>
                  </a>
                )}
                <a href={`mailto:${config.contactEmail}`} className="support-channel">
                  <span className="ic">{SOCIAL_ICONS.mail}</span>
                  <span><span className="lbl">البريد الإلكتروني</span><br /><span className="val">{config.contactEmail}</span></span>
                </a>
                {config.facebookUrl && (
                  <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="support-channel">
                    <span className="ic">{SOCIAL_ICONS.facebook}</span>
                    <span><span className="lbl">فيسبوك</span><br /><span className="val">صفحة Showme TV</span></span>
                  </a>
                )}
              </div>
            </div>

            <form className="support-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="f-name">الاسم</label>
                <input id="f-name" type="text" placeholder="اسمك الكامل" required
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-row">
                <label htmlFor="f-email">كيف نتواصل معك؟ (اختياري)</label>
                <input id="f-email" type="text" placeholder="إيميل، رقم واتساب، أو يوزر تيليجرام"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-row">
                <label htmlFor="f-msg">رسالتك</label>
                <textarea id="f-msg" placeholder="اكتب سؤالك أو المشكلة التي تواجهها..." required
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary form-submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'جاري الإرسال...' : isSupabaseConfigured ? c.contactFormSubmit : 'إرسال عبر تيليجرام'}
              </button>
              {result && result.ok && (
                <div className="form-status show">
                  {result.mode === 'supabase'
                    ? '✅ وصلتنا رسالتك! فريق الدعم رح يتواصل معك قريباً.'
                    : 'فُتحت لك محادثة تيليجرام ورسالتك جاهزة بداخلها — يكفي الضغط على "إرسال" هناك.'}
                </div>
              )}
              <p className="form-note">
                أو راسلنا مباشرة على <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
