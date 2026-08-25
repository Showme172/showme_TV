import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { telegramLink } from '../config';

/**
 * بيرجع دالة send(payload) بترسل الرسالة:
 * - إذا Supabase متصل: بتخزن الرسالة بجدول messages (بتطلع بلوحة الأدمن برقم تذكرة).
 * - إذا مو متصل بعد: بتفتح تيليجرام برسالة جاهزة (نفس السلوك القديم، ما في انقطاع بالخدمة).
 */
export function useSendMessage() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  async function send({ name, email, message, channel = 'website_form' }) {
    setStatus('sending');

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('messages').insert({
        name,
        email,
        message,
        channel,
        status: 'open',
      });
      if (error) {
        console.error(error);
        setStatus('error');
        return { ok: false, mode: 'supabase' };
      }
      setStatus('sent');
      return { ok: true, mode: 'supabase' };
    }

    // بديل احتياطي: تيليجرام (لحد ما تضيف مفاتيح Supabase)
    const fullMessage = `مرحباً، أنا ${name} (${email})\n\n${message}`;
    window.open(telegramLink(fullMessage), '_blank', 'noopener');
    setStatus('sent');
    return { ok: true, mode: 'telegram' };
  }

  return { send, status };
}
