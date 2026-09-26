import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminConversations() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const threadRef = useRef(null);

  useEffect(() => {
    let channel;
    async function load() {
      const { data } = await supabase.from('conversations').select('*').order('created_at', { ascending: false });
      setConversations(data || []);
    }
    load();
    channel = supabase
      .channel('conversations_list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    if (!activeId) return;
    let channel;
    async function load() {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', activeId)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    }
    load();
    channel = supabase
      .channel(`admin_chat_${activeId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${activeId}` },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [activeId]);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages]);

  async function sendReply(e) {
    e.preventDefault();
    if (!draft.trim() || !activeId) return;
    const body = draft.trim();
    setDraft('');

    if (active && !active.assigned_agent_no) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: myProfile } = await supabase.from('profiles').select('agent_no').eq('id', userData.user.id).single();
        if (myProfile?.agent_no) {
          await supabase.from('conversations').update({ assigned_agent_no: myProfile.agent_no, status: 'claimed' }).eq('id', activeId);
        }
      }
    }

    await supabase.from('chat_messages').insert({ conversation_id: activeId, sender: 'agent', body });
  }

  async function closeConversation(id) {
    await supabase.from('conversations').update({ status: 'closed' }).eq('id', id);
  }

  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="conv-layout">
      <div className="conv-list">
        {conversations.length === 0 && <p className="hint">ما في محادثات حالياً.</p>}
        {conversations.map((c) => (
          <button
            key={c.id}
            className={`conv-list-item ${activeId === c.id ? 'active' : ''} ${c.status === 'closed' ? 'closed' : ''}`}
            onClick={() => setActiveId(c.id)}
          >
            <span className="ticket">#{1000 + c.id}</span>
            <span className="conv-name">{c.customer_name || 'زائر'}</span>
            {c.assigned_agent_no && <span className="chan-badge">#{c.assigned_agent_no}</span>}
          </button>
        ))}
      </div>

      <div className="conv-thread-panel">
        {!active && <p className="hint">اختار محادثة من القائمة لعرضها.</p>}
        {active && (
          <>
            <div className="conv-thread-head">
              <div>
                <b>{active.customer_name || 'زائر'}</b>
                <span className="text-dim"> — {active.customer_email}</span>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => closeConversation(active.id)}>
                إغلاق المحادثة
              </button>
            </div>

            <div className="chat-thread admin-chat-thread" ref={threadRef}>
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.sender === 'agent' ? 'admin-sent' : 'admin-received'}`}>
                  {m.body}
                </div>
              ))}
            </div>

            <form className="chat-input-row" onSubmit={sendReply}>
              <input type="text" placeholder="اكتب ردك..." value={draft} onChange={(e) => setDraft(e.target.value)} />
              <button type="submit" className="chat-send-btn" aria-label="إرسال">➤</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
