import { useEffect, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminInbox from './AdminInbox';
import AdminConversations from './AdminConversations';
import AdminSettings from './AdminSettings';
import AdminAgents from './AdminAgents';
import AdminReviews from './AdminReviews';
import AdminApps from './AdminApps';
import AdminAnnouncement from './AdminAnnouncement';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('inbox');
  const heartbeatRef = useRef(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [session]);

  useEffect(() => {
    if (!session) return;
    async function beat() {
      await supabase.from('agent_presence').upsert({ agent_id: session.user.id, last_seen: new Date().toISOString() });
    }
    beat();
    heartbeatRef.current = setInterval(beat, 25000);
    return () => clearInterval(heartbeatRef.current);
  }, [session]);

  if (!isSupabaseConfigured) {
    return (
      <main>
        <div className="page-hero">
          <div className="wrap">
            <span className="eyebrow"><span className="dot"></span>لوحة التحكم</span>
            <h1>لوحة التحكم مو متصلة بعد.</h1>
            <p>
              لتفعيل صندوق الرسائل الحي ولوحة التحكم، لازم تضيف مفاتيح Supabase بملف <code>.env</code>.
              راجع ملف <code>README.md</code> بالمشروع للخطوات كاملة.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (checking) {
    return <main><div className="page-hero"><div className="wrap"><p>جاري التحقق...</p></div></div></main>;
  }

  if (!session) {
    return <main><AdminLogin onLoggedIn={setSession} /></main>;
  }

  const isOwner = profile?.role === 'owner';

  return (
    <main>
      <div className="page-hero admin-page-hero">
        <div className="wrap admin-topbar">
          <div>
            <span className="eyebrow"><span className="dot"></span>لوحة التحكم</span>
            <h1>
              أهلاً، {profile?.display_name || session.user.email}
              {profile?.agent_no && <span className="agent-role-badge" style={{ marginInlineStart: 10 }}>#{profile.agent_no}</span>}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="https://web.telegram.org" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              تيليجرام ويب ↗
            </a>
            <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              واتساب ويب ↗
            </a>
            <button className="btn btn-outline btn-sm" onClick={() => supabase.auth.signOut()}>تسجيل الخروج</button>
          </div>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="admin-tabs">
            <button className={tab === 'inbox' ? 'active' : ''} onClick={() => setTab('inbox')}>📨 الرسائل</button>
            <button className={tab === 'conversations' ? 'active' : ''} onClick={() => setTab('conversations')}>💬 المحادثات المباشرة</button>
            {isOwner && <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>⚙️ محتوى الموقع</button>}
            {isOwner && <button className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>⭐ آراء الزبائن</button>}
            {isOwner && <button className={tab === 'apps' ? 'active' : ''} onClick={() => setTab('apps')}>📱 التطبيقات</button>}
            {isOwner && <button className={tab === 'announcement' ? 'active' : ''} onClick={() => setTab('announcement')}>📢 الإعلانات</button>}
            {isOwner && <button className={tab === 'agents' ? 'active' : ''} onClick={() => setTab('agents')}>👥 الموظفون</button>}
          </div>

          {tab === 'inbox' && <AdminInbox />}
          {tab === 'conversations' && <AdminConversations />}
          {tab === 'settings' && isOwner && <AdminSettings />}
          {tab === 'reviews' && isOwner && <AdminReviews />}
          {tab === 'apps' && isOwner && <AdminApps />}
          {tab === 'announcement' && isOwner && <AdminAnnouncement />}
          {tab === 'agents' && isOwner && <AdminAgents />}
        </div>
      </section>
    </main>
  );
}
