import Reveal from './Reveal';
import { ICONS } from './Icons';

export default function CategoryGrid({ categories }) {
  return (
    <div className="category-grid">
      {categories.map((c, i) => (
        <Reveal key={i} delay={Math.min(i * 70, 420)}>
          <div className="category-card">
            <div className="cat-top">
              <div className="icon">{ICONS[c.icon] || ICONS.globe}</div>
              <span className="count">{c.count}</span>
            </div>
            <h3>{c.name}</h3>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
