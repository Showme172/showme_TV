import { useEffect, useRef, useState } from 'react';

const METHODS = [
  { id: 'phone', label: 'رقم هاتف', placeholder: '+963...' },
  { id: 'email', label: 'إيميل', placeholder: 'you@example.com' },
  { id: 'telegram', label: 'يوزر تيليجرام', placeholder: '@username' },
];

const POLL_MS = 2500;
const STORAGE_KEY = 'inquiry_conversation_id';

function functionsUrl(name) {
  const base = import.meta.env.VITE_SUPABASE_URL;
  return base ? `${base}/functions/v1/${name}` : null;
}

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState('phone');
  const [form, setForm] = useState({ name: '', contact: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const [conversationId, setConversationId] = useState(() => {
    try { return sessionStorage.getItem(STORAGE_KEY); } catch { return null; }
  });
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const threadRef = useRef(null);
  const lastTsRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;
    let stopped = false;

    async function poll() {
      const url = functionsUrl('inquiry-poll');
      if (!url) return;
      const qs = new URLSearchParams({ conversation_id: conversationId });
      if (lastTsRef.current) qs.set('after', lastTsRef.current);
      try {
        const res = await fetch(`${url}?${qs.toString()}`);
        const data = await res.json();
        if (data.ok && data.messages.length) {
          setMessages((prev) => [...prev, ...data.messages]);
          lastTsRef.current = data.messages[data.messages.length - 1].created_at;
        }
      } catch { /* تجاهل فشل محاولة واحدة */ }
      if (!stopped) setTimeout(poll, POLL_MS);
    }
    poll();
    return () => { stopped = true; };
  }, [conversationId]);

  function toggle() {
    setOpen((v) => !v);
  }

  async function handleStart(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) return;

    setStatus('sending');
    const url = functionsUrl('inquiry-start');
    if (!url) { setStatus('error'); return; }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          contact_method: method,
          contact_value: form.contact.trim(),
          message: form.message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'فشل الإرسال');

      setConversationId(data.conversation_id);
      try { sessionStorage.setItem(STORAGE_KEY, data.conversation_id); } catch { /* noop */ }
      setMessages([{ sender: 'visitor', body: form.message.trim(), created_at: new Date().toISOString() }]);
      lastTsRef.current = new Date().toISOString();
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !conversationId) return;

    setDraft('');
    setMessages((prev) => [...prev, { sender: 'visitor', body: text, created_at: new Date().toISOString() }]);

    const url = functionsUrl('inquiry-send');
    if (!url) return;
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId, message: text }),
      });
    } catch { /* هيك رح تضل الرسالة ظاهرة عند الزائر، وبترسل تلقائياً بالمحاولة الجاية */ }
  }

  const activeMethod = METHODS.find((m) => m.id === method);

  return (
    <div className="live-chat">
      {open && (
        <div className="live-chat-panel">
          <div className="live-chat-head">
            <div className="live-chat-head-info">
              <b>تواصل معنا</b>
              <span>بنرد عليك بأقرب وقت</span>
            </div>
            <button className="live-chat-close" onClick={toggle} aria-label="إغلاق">✕</button>
          </div>

          <div className="live-chat-body">
            {conversationId ? (
              <div className="live-chat-thread-wrap">
                <div className="live-chat-thread" ref={threadRef}>
                  {messages.map((m, i) => (
                    <div key={i} className={`chat-bubble ${m.sender === 'agent' ? 'chat-bubble-agent' : 'chat-bubble-visitor'}`}>
                      {m.body}
                    </div>
                  ))}
                </div>
                <form className="live-chat-reply-row" onSubmit={handleSend}>
                  <input
                    placeholder="اكتب رسالتك..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">إرسال</button>
                </form>
              </div>
            ) : (
              <form className="live-chat-form" onSubmit={handleStart}>
                <p className="live-chat-greeting">اكتبلنا اسمك ووسيلة تواصل، وشو بتحب تسألنا.</p>

                <input
                  placeholder="اسمك"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />

                <div className="live-chat-method-row">
                  {METHODS.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      className={`live-chat-method-btn ${method === m.id ? 'active' : ''}`}
                      onClick={() => setMethod(m.id)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <input
                  placeholder={activeMethod.placeholder}
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  required
                />

                <textarea
                  placeholder="اكتب رسالتك هون..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />

                {status === 'error' && (
                  <p className="form-error">صار خطأ بالإرسال، جرّب مرة تانية.</p>
                )}

                <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                  {status === 'sending' ? 'جاري الإرسال...' : 'بدء المحادثة'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <button className="live-chat-toggle" onClick={toggle} aria-label="تواصل معنا">
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
