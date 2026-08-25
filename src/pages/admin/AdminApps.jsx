import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

function normalizeUrl(url) {
  const trimmed = (url || '').trim();
  if (!trimmed) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export default function AdminApps() {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({ name: '', version: '', download_url: '', downloader_code: '', icon_file: null });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  async function load() {
    const { data } = await supabase.from('apps').select('*').order('sort_order', { ascending: true });
    setApps(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);

    let icon_url = null;
    if (form.icon_file) {
      const path = `${Date.now()}-${form.icon_file.name}`;
      const { error: uploadError } = await supabase.storage.from('apps').upload(path, form.icon_file);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('apps').getPublicUrl(path);
        icon_url = urlData.publicUrl;
      }
    }

    await supabase.from('apps').insert({
      name: form.name,
      version: form.version || null,
      download_url: normalizeUrl(form.download_url),
      downloader_code: form.downloader_code || null,
      icon_url,
      sort_order: apps.length,
    });

    setForm({ name: '', version: '', download_url: '', downloader_code: '', icon_file: null });
    setSaving(false);
    load();
  }

  async function handleDelete(id) {
    await supabase.from('apps').delete().eq('id', id);
    load();
  }

  async function move(id, direction) {
    const idx = apps.findIndex((a) => a.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= apps.length) return;
    const a = apps[idx];
    const b = apps[swapIdx];
    await supabase.from('apps').update({ sort_order: b.sort_order }).eq('id', a.id);
    await supabase.from('apps').update({ sort_order: a.sort_order }).eq('id', b.id);
    load();
  }

  function startEdit(app) {
    setEditingId(app.id);
    setEditForm({
      name: app.name,
      version: app.version || '',
      download_url: app.download_url || '',
      downloader_code: app.downloader_code || '',
    });
  }

  async function saveEdit(id) {
    await supabase.from('apps').update({
      name: editForm.name,
      version: editForm.version || null,
      download_url: normalizeUrl(editForm.download_url),
      downloader_code: editForm.downloader_code || null,
    }).eq('id', id);
    setEditingId(null);
    load();
  }

  return (
    <div className="admin-section">
      <h2>تطبيقات التحميل</h2>
      <p className="hint">ضيف تطبيقاتك هون. بتظهر مباشرة بصفحة "التطبيقات" بالموقع، وترتيبها هون هو نفس ترتيبها هناك.</p>

      <form onSubmit={handleAdd}>
        <div className="row3">
          <div className="field"><label>اسم التطبيق</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>رقم الإصدار</label><input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="مثلاً 1.2.0" /></div>
          <div className="field"><label>رابط التحميل المباشر</label><input required value={form.download_url} onChange={(e) => setForm({ ...form, download_url: e.target.value })} placeholder="example.com/app.apk" /></div>
        </div>
        <div className="field">
          <label>كود Downloader (اختياري)</label>
          <input value={form.downloader_code} onChange={(e) => setForm({ ...form, downloader_code: e.target.value })} placeholder="مثلاً 483920 — لتطبيق Downloader على أجهزة Fire TV/Android TV" />
        </div>
        <div className="field">
          <label>شعار التطبيق (اختياري)</label>
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, icon_file: e.target.files[0] })} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'جاري الإضافة...' : 'إضافة التطبيق'}</button>
      </form>

      <div className="inbox-list" style={{ marginTop: 24 }}>
        {apps.map((app) => (
          <div className="inbox-item" key={app.id}>
            {editingId === app.id ? (
              <>
                <div className="row3">
                  <div className="field"><label>اسم التطبيق</label><input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
                  <div className="field"><label>رقم الإصدار</label><input value={editForm.version} onChange={(e) => setEditForm({ ...editForm, version: e.target.value })} /></div>
                  <div className="field"><label>رابط التحميل</label><input value={editForm.download_url} onChange={(e) => setEditForm({ ...editForm, download_url: e.target.value })} /></div>
                </div>
                <div className="field"><label>كود Downloader</label><input value={editForm.downloader_code} onChange={(e) => setEditForm({ ...editForm, downloader_code: e.target.value })} /></div>
                <div className="inbox-item-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => saveEdit(app.id)}>حفظ</button>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>إلغاء</button>
                </div>
              </>
            ) : (
              <>
                <div className="inbox-item-head">
                  <b>{app.name}</b>
                  {app.version && <span className="chan-badge">v{app.version}</span>}
                  {app.downloader_code && <span className="chan-badge">Downloader: {app.downloader_code}</span>}
                </div>
                <p className="text-dim" style={{ fontSize: 13, wordBreak: 'break-all' }}>{app.download_url}</p>
                <div className="inbox-item-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => startEdit(app)}>✎ تعديل</button>
                  <button className="btn btn-outline btn-sm" onClick={() => move(app.id, 'up')}>↑ لفوق</button>
                  <button className="btn btn-outline btn-sm" onClick={() => move(app.id, 'down')}>↓ لتحت</button>
                  <button className="btn btn-outline btn-sm" onClick={() => handleDelete(app.id)}>حذف</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
