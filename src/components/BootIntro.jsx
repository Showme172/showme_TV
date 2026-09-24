import { useEffect, useState } from 'react';

export default function BootIntro() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem('tv_intro_shown');
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) return;
    try { sessionStorage.setItem('tv_intro_shown', '1'); } catch { /* noop */ }

    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = '';
    }, 2500);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="tv-intro" aria-hidden="true">
      <div className="tv-intro-flash"></div>
      <div className="tv-intro-scanline"></div>
      <div className="tv-intro-logo">
        <img src="/logo.png" alt="Showme TV" />
      </div>
    </div>
  );
}
