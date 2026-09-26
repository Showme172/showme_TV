import { useEffect, useRef, useState } from 'react';

export default function AnimatedPrice({ value, active, duration = 900 }) {
  const match = String(value).match(/^(\D*)(\d+(?:[.,]\d+)?)(\D*)$/);
  const prefix = match ? match[1] : '';
  const target = match ? parseFloat(match[2].replace(',', '.')) : 0;
  const suffix = match ? match[3] : '';
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current || !match) return;
    started.current = true;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(target);
    }
    requestAnimationFrame(tick);
  }, [active, target, duration, match]);

  if (!match) return <>{value}</>;
  return <>{prefix}{display}{suffix}</>;
}
