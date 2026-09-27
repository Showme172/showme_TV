import Reveal from './Reveal';
import { ICONS } from './Icons';
import { tiltHandlers } from '../hooks/useTilt';

export default function FeatureGrid({ items }) {
  return (
    <div className="feature-grid">
      {items.map((f, i) => (
        <Reveal key={i} delay={Math.min((i % 3) * 70, 210)}>
          <div className="feature-card" {...tiltHandlers()}>
            <span className="tag">{String(i + 1).padStart(2, '0')}</span>
            <div className="icon">{ICONS[f.icon] || ICONS.bolt}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
