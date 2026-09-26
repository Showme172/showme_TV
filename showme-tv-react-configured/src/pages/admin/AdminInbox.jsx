import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const CHANNEL_LABELS = {
  website_form: 'نموذج الموقع',
  live_chat: 'الدردشة المباشرة',
  telegram: 'تيليجرام',
  whatsapp: 'واتساب',
  messenger: 'ماسنجر',
};

function TelegramReplyBox({ message }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    const { error } = await supabase.functions.invoke('telegram-reply', {
      body: { chat_id: message.external_id, text: text.trim() },
    });
    setSending(false);
    if (!error) {
      setSent(true);
      setText('');
    }
  }

  return (
    <form className="chat-input-row" style={{ marginTop: 10 }} onSubmit={handleSend}>
      <input
        type="text"
        placeholder="اكتب ردك، رح يوصله مباشرة عبر تيليجرام..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="chat-send-btn" disabled={sending} aria-label="إرسال">➤</button>
      {sent && <span className="hint" style={{ alignSelf: 'center' }}>✅ انبعتت</span>}
    </form>
  );
}

export default function AdminInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open');

  useEffect(() => {
    let channel;

    async function load() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      setMessages(data || []);
      setLoading(false);
    }

    load();

    channel = supabase
      .channel('messages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        load();
      })
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  async function setStatus(id, status) {
    await supabase.from('messages').update({ status }).eq('id', id);
  }

  const filtered = messages.filter((m) => (filter === 'all' ? true : m.status === filter));

  return (
    <div>
      <div className="admin-inbox-filters">
        {['open', 'resolved', 'all'].map((f) => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'open' ? 'مفتوحة' : f === 'resolved' ? 'محلولة' : 'الكل'}
          </button>
        ))}
      </div>

      {loading && <p className="hint">جاري التحميل...</p>}
      {!loading && filtered.length === 0 && <p className="hint">ما في رسائل هون حالياً.</p>}

      <div className="inbox-list">
        {filtered.map((m) => (
          <div key={m.id} className={`inbox-item ${m.status === 'resolved' ? 'resolved' : ''}`}>
            <div className="inbox-item-head">
              <span className="ticket">#{1000 + m.id}</span>
              <span className="chan-badge">{CHANNEL_LABELS[m.channel] || m.channel}</span>
              <span className="inbox-date">{new Date(m.created_at).toLocaleString('ar-EG')}</span>
            </div>
            <div className="inbox-item-body">
              <p><b>{m.name}</b> — <span className="text-dim">{m.email}</span></p>
              <p className="inbox-message">{m.message}</p>
            </div>
            <div className="inbox-item-actions">
              {m.status !== 'resolved' ? (
                <button className="btn btn-outline btn-sm" onClick={() => setStatus(m.id, 'resolved')}>تعليم كمحلولة</button>
              ) : (
                <button className="btn btn-outline btn-sm" onClick={() => setStatus(m.id, 'open')}>إعادة فتح</button>
              )}
              {m.channel !== 'telegram' && (
                <a className="btn btn-primary btn-sm" href={`mailto:${m.email}`}>الرد بالإيميل</a>
              )}
            </div>
            {m.channel === 'telegram' && m.external_id && <TelegramReplyBox message={m} />}
          </div>
        ))}
      </div>
    </div>
  );
}
