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
          </div>
        </div>
      </section>
    </main>
  );
}
