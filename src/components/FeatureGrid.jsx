import { useState } from 'react';
import Reveal from './Reveal';
import { ICONS } from './Icons';

export default function FeatureGrid({ items }) {
  const [visibleCount, setVisibleCount] = useState(3);
  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <>
      <div className="feature-grid">
        {visible.map((f, i) => (
          <Reveal key={i} delay={Math.min((i % 3) * 70, 210)}>
            <div className="feature-card">
              <span className="tag">{String(i + 1).padStart(2, '0')}</span>
              <div className="icon">{ICONS[f.icon] || ICONS.bolt}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
      {hasMore && (
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <button className="btn btn-outline" onClick={() => setVisibleCount((c) => Math.min(c + 3, items.length))}>
            عرض المزيد
          </button>
        </div>
      )}
    </>
  );
}
