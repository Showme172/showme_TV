import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: '', name: '', password: '', role: 'agent' });
  const [status, setStatus] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  async function loadAgents() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: true });
    setAgents(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAgents();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setStatus('جاري الإنشاء...');
    const { data, error } = await supabase.functions.invoke('create-agent', { body: form });
    if (error) {
      setStatus('⚠️ ما قدرت أعمل الحساب — تأكد إنك نشرت الـ Edge Function (راجع README).');
      return;
    }
    setStatus('✅ تم إنشاء الحساب.');
    setForm({ email: '', name: '', password: '', role: 'agent' });
    loadAgents();
  }

  function startEdit(agent) {
    setEditingId(agent.id);
    setEditValue(agent.display_name || '');
  }

  async function saveEdit(id) {
    await supabase.from('profiles').update({ display_name: editValue }).eq('id', id);
    setEditingId(null);
    loadAgents();
  }

  async function toggleRole(agent) {
    const newRole = agent.role === 'owner' ? 'agent' : 'owner';
    await supabase.from('profiles').update({ role: newRole }).eq('id', agent.id);
    loadAgents();
  }

  return (
    <div>
      <div className="admin-section">
        <h2>إضافة موظف جديد</h2>
        <p className="hint">
          بتعمل حساب لموظف يقدر يسجّل دخول على نفس لوحة التحكم. هاد الجزء بيحتاج نشر (Deploy) لملف
          <code> create-agent </code> الموجود بمجلد <code>supabase/functions</code> — الخطوات موجودة بملف README.
        </p>
        <form onSubmit={handleCreate}>
          <div className="row3">
            <div className="field"><label>الاسم</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="field"><label>الإيميل</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="field"><label>كلمة سر مؤقتة</label><input type="text" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          </div>
          <div className="field" style={{ maxWidth: 320 }}>
            <label>الصلاحية</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '11px 13px', color: 'var(--text)', fontFamily: 'var(--sans)' }}
            >
              <option value="agent">موظف رد فقط — رسائل ولايف تشات بس</option>
              <option value="owner">صلاحية كاملة — نفس صلاحياتي أنا</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">إنشاء الحساب</button>
          {status && <p className="hint" style={{ marginTop: 12 }}>{status}</p>}
        </form>
      </div>

      <div className="admin-section">
        <h2>الموظفون الحاليون</h2>
        {loading && <p className="hint">جاري التحميل...</p>}
        {!loading && agents.length === 0 && <p className="hint">لسا ما في موظفين مضافين.</p>}
        <div className="inbox-list">
          {agents.map((a) => (
            <div key={a.id} className="inbox-item">
              <div className="inbox-item-head">
                <span className="ticket">#{a.agent_no}</span>
                {a.role === 'owner' && <span className="agent-role-badge">مالك</span>}
                <span className="inbox-date">{new Date(a.created_at).toLocaleDateString('ar-EG')}</span>
              </div>
              <div className="inbox-item-body">
                {editingId === a.id ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="اسم الموظف الحقيقي (ملاحظة خاصة تشوفها إنت بس)"
                      style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', color: 'var(--text)' }}
                    />
                    <button className="btn btn-primary btn-sm" onClick={() => saveEdit(a.id)}>حفظ</button>
                  </div>
                ) : (
                  <p onClick={() => startEdit(a)} style={{ cursor: 'pointer' }}>
                    <b>{a.display_name || 'بدون اسم — اضغط للإضافة'}</b>
                    <span className="text-dim" style={{ marginInlineStart: 8, fontSize: 12 }}>✎ تعديل</span>
                  </p>
                )}
              </div>
              <div className="inbox-item-actions">
                <button className="btn btn-outline btn-sm" onClick={() => toggleRole(a)}>
                  {a.role === 'owner' ? '⬇ خليه رد فقط' : '⬆ اعطيه صلاحية كاملة'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
