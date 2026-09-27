import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const T = {
  ar: { shareText: 'شوف Showme TV — اشتراك IPTV احترافي، قنوات وأفلام بلا انقطاع.', copied: '✅ تم نسخ الرابط', share: '🔗 شارك الموقع' },
  en: { shareText: 'Check out Showme TV — professional IPTV subscription, channels and movies without interruption.', copied: '✅ Link copied', share: '🔗 Share the site' },
};

export default function ShareButton({ className }) {
  const { lang } = useLanguage();
  const t = T[lang];
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.origin;
    const title = 'Showme TV';
    const text = t.shareText;

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
      {copied ? t.copied : t.share}
    </button>
  );
}
