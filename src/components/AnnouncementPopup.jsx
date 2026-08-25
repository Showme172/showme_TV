import { useEffect, useState } from 'react';
import { useAnnouncement } from '../hooks/useAnnouncement';

function useCountdown(announcement) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!announcement) return;
    const endTime = new Date(announcement.created_at).getTime() + announcement.duration_hours * 3600000;

    function tick() {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        setLabel('');
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = (n) => String(n).padStart(2, '0');
      setLabel(`${pad(h)}:${pad(m)}:${pad(s)}`);
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [announcement]);

  return label;
}

export default function AnnouncementPopup() {
  const announcement = useAnnouncement();
  const [dismissed, setDismissed] = useState(false);
  const [show, setShow] = useState(false);
  const countdown = useCountdown(announcement);

  useEffect(() => {
    if (!announcement) return;
    const key = `dismissed_announcement_${announcement.id}`;
    if (localStorage.getItem(key)) {
      setDismissed(true);
      return;
    }
    setDismissed(false);
    const t = setTimeout(() => setShow(true), 900);
    return () => clearTimeout(t);
  }, [announcement]);

  if (!announcement || dismissed || !show) return null;

  function close() {
    localStorage.setItem(`dismissed_announcement_${announcement.id}`, '1');
    setShow(false);
    setDismissed(true);
  }

  return (
    <div className="announcement-overlay" onClick={close}>
      <div className="announcement-modal" onClick={(e) => e.stopPropagation()}>
        <button className="contact-modal-close" onClick={close} aria-label="إغلاق">✕</button>
        <span className="announcement-badge">📢 إعلان</span>
        <p>{announcement.message}</p>
        {countdown && (
          <div className="announcement-countdown">
            <span>ينتهي العرض خلال</span>
            <b>{countdown}</b>
          </div>
        )}
      </div>
    </div>
  );
}
