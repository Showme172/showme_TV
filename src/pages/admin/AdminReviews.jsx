import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');

  async function load() {
    const { data } = await supabase.from('reviews').select('*').order('sort_order', { ascending: true });
    setReviews(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const path = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('reviews').upload(path, file);
    if (uploadError) {
      alert('صار خطأ بالرفع: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('reviews').getPublicUrl(path);
    await supabase.from('reviews').insert({
      image_url: urlData.publicUrl,
      caption: caption.trim() || null,
      sort_order: reviews.length,
    });

    setCaption('');
    setUploading(false);
    load();
    e.target.value = '';
  }

  async function handleDelete(id) {
    await supabase.from('reviews').delete().eq('id', id);
    load();
  }

  return (
    <div className="admin-section">
      <h2>آراء الزبائن</h2>
      <p className="hint">ارفع لقطات شاشة من رسائل أو تقييمات زبائن. بتظهر مباشرة بصفحة "آراء الزبائن" بالموقع.</p>

      <div className="field">
        <label>تعليق مختصر (اختياري)</label>
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="مثلاً: زبون من دمشق" />
      </div>
      <div className="field">
        <label>اختر صورة</label>
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
      </div>
      {uploading && <p className="hint">جاري الرفع...</p>}

      <div className="review-upload-grid">
        {reviews.map((r) => (
          <div className="review-upload-item" key={r.id}>
            <img src={r.image_url} alt={r.caption || ''} />
            <button onClick={() => handleDelete(r.id)} title="حذف">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
