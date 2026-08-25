import { useState } from 'react';

export default function ShareButton({ className }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.origin;
    const title = 'Showme TV';
    const text = 'شوف Showme TV — اشتراك IPTV احترافي، قنوات وأفلام بلا انقطاع.';

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (e) {
        // المستخدم ألغى المشاركة، ولا داعي لأي رسالة خطأ
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank', 'noopener');
    }
  }

  return (
    <button type="button" className={className} onClick={handleShare}>
      {copied ? '✅ تم نسخ الرابط' : '🔗 شارك الموقع'}
    </button>
  );
}
