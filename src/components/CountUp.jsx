import { useEffect, useRef, useState } from 'react';

export default function CountUp({ text }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(text);
  const done = useRef(false);

  useEffect(() => {
    const match = text.match(/^([\d,]+)(.*)$/);
    if (!match) return;
    const target = parseInt(match[1].replace(/,/g, ''), 10);
    const suffix = match[2];

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !done.current) {
            done.current = true;
            const duration = 1100;
            const start = performance.now();
            function tick(now) {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              const current = Math.round(target * eased);
              setDisplay(current.toLocaleString('en-US') + suffix);
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [text]);

  return <b ref={ref}>{display}</b>;
}
