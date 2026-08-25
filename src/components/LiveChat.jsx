import { useEffect, useRef, useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { telegramLink } from '../config';

export default function LiveChat() {
  const config = useConfig();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('menu'); // menu | answer | details | chat
  const [activeItem, setActiveItem] = useState(null);
  const [details, setDetails] = useState({ name: '', email: '' });
  const [conversation, setConversation] = useState(null); // { id, agentNo, agentName }
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [starting, setStarting] = useState(false);
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!conversation || !isSupabaseConfigured) return;
    const channel = supabase
      .channel(`chat_${conversation.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${conversation.id}` },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'conversations', filter: `id=eq.${conversation.id}` },
        (payload) => {
          if (payload.new.assigned_agent_no) {
            setConversation((prev) => (prev ? { ...prev, agentNo: payload.new.assigned_agent_no } : prev));
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [conversation?.id]);

  function openItem(item) {
    setActiveItem(item);
    setView('answer');
  }

  function backToMenu() {
    setView('menu');
    setActiveItem(null);
  }

  async function findOnlineAgent() {
    const cutoff = new Date(Date.now() - 90 * 1000).toISOString();
    const { data } = await supabase
      .from('agent_presence')
      .select('agent_id, last_seen, profiles(agent_no, display_name)')
      .gte('last_seen', cutoff)
      .limit(1);
    if (data && data.length > 0 && data[0].profiles) {
      return data[0].profiles;
    }
    return null;
  }

  async function startConversation(e) {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      const context = activeItem
        ? `بخصوص: ${activeItem.q}\n\nأنا ${details.name} (${details.email})`
        : `أنا ${details.name} (${details.email})`;
      window.open(telegramLink(context), '_blank', 'noopener');
      return;
    }

    setStarting(true);
    const agent = await findOnlineAgent();

    const { data: conv, error } = await supabase
      .from('conversations')
      .insert({
        customer_name: details.name,
        customer_email: details.email,
        assigned_agent_no: agent ? agent.agent_no : null,
      })
      .select()
      .single();

    if (error || !conv) {
      setStarting(false);
      return;
    }

    const firstMessage = activeItem ? `بخصوص: ${activeItem.q}` : 'بدي أتكلم مع فريق الدعم';
    await supabase.from('chat_messages').insert({ conversation_id: conv.id, sender: 'customer', body: firstMessage });

    setMessages([{ sender: 'customer', body: firstMessage, created_at: new Date().toISOString() }]);
    setConversation({ id: conv.id, agentNo: agent?.agent_no || null, agentName: agent?.display_name || null });
    setStarting(false);
    setView('chat');
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!draft.trim() || !conversation) return;
    const body = draft.trim();
    setDraft('');
    setMessages((prev) => [...prev, { sender: 'customer', body, created_at: new Date().toISOString() }]);
    await supabase.from('chat_messages').insert({ conversation_id: conversation.id, sender: 'customer', body });
  }

  return (
    <div className={`live-chat ${open ? 'open' : ''}`}>
      {open && (
        <div className="live-chat-panel">
          <div className="live-chat-head">
            <div className="live-chat-head-info">
              <span className="mark"><img src="/logo-icon.png" alt="Showme TV" /></span>
              <div>
                <b>{config.copy.liveChatTitle}</b>
                <span>{config.copy.liveChatSubtitle}</span>
              </div>
            </div>
            <button className="live-chat-close" onClick={() => setOpen(false)} aria-label="إغلاق">✕</button>
          </div>

          <div className="live-chat-body">
            {view === 'menu' && (
              <>
                <p className="live-chat-greeting">{config.copy.liveChatGreeting}</p>
                <div className="quick-help-list">
                  {config.quickHelp.map((item, i) => (
                    <button key={i} className="quick-help-btn" onClick={() => openItem(item)}>{item.q}</button>
                  ))}
                </div>
                <button className="quick-help-btn escalate-btn" onClick={() => setView('details')}>
                  {config.copy.liveChatEscalateBtn}
                </button>
              </>
            )}

            {view === 'answer' && activeItem && (
              <>
                <button className="live-chat-back" onClick={backToMenu}>← رجوع</button>
                <p className="live-chat-question">{activeItem.q}</p>
                <p className="live-chat-answer">{activeItem.a}</p>
                <div className="live-chat-resolved-row">
                  <button className="btn btn-outline btn-sm" onClick={backToMenu}>تم الحل 👍</button>
                  <button className="btn btn-primary btn-sm" onClick={() => setView('details')}>
                    لسا في مشكلة، حوّلني لفريق الدعم
                  </button>
                </div>
              </>
            )}

            {view === 'details' && (
              <>
                <button className="live-chat-back" onClick={() => setView(activeItem ? 'answer' : 'menu')}>← رجوع</button>
                <form className="live-chat-form" onSubmit={startConversation}>
                  <input
                    type="text" placeholder="اسمك" required
                    value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  />
                  <input
                    type="text" placeholder="كيف نتواصل معك؟ إيميل، واتساب، أو تيليجرام (اختياري)"
                    value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })}
                  />
                  <button type="submit" className="btn btn-primary form-submit" disabled={starting}>
                    {starting ? 'جاري الاتصال...' : 'بدء المحادثة'}
                  </button>
                </form>
              </>
            )}

            {view === 'chat' && conversation && (
              <>
                <div className="agent-card">
                  <div className="agent-avatar">{conversation.agentNo ? `#${conversation.agentNo}` : '…'}</div>
                  <div>
                    {conversation.agentNo ? (
                      <>
                        <b><span className="agent-status-dot"></span>الموظف #{conversation.agentNo}</b>
                        <span>متصل الآن</span>
                      </>
                    ) : (
                      <>
                        <b><span className="agent-status-dot offline"></span>بانتظار موظف</b>
                        <span>رسالتك محفوظة، رح نرد أول ما يتوفر أحد</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="chat-thread" ref={threadRef}>
                  {messages.map((m, i) => (
                    <div key={i} className={`chat-bubble ${m.sender}`}>{m.body}</div>
                  ))}
                </div>

                <form className="chat-input-row" onSubmit={sendMessage}>
                  <input
                    type="text" placeholder="اكتب رسالتك..."
                    value={draft} onChange={(e) => setDraft(e.target.value)}
                  />
                  <button type="submit" className="chat-send-btn" aria-label="إرسال">➤</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <button className="live-chat-toggle" onClick={() => setOpen(!open)} aria-label="فتح الدردشة">
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
