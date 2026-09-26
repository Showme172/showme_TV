import { ICONS } from './Icons';

export default function TrustBadges({ items }) {
  return (
    <div className="trust-badges">
      {items.map((b, i) => (
        <div className="trust-badge" key={i}>
          <span className="trust-badge-icon">{ICONS[b.icon] || ICONS.shield}</span>
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
}
