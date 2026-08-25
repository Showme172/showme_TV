import Reveal from './Reveal';
import { CHECK } from './Icons';
import ContactButton from './ContactButton';

export default function PricingGrid({ plans, selectedIndex, onSelect }) {
  return (
    <div className="pricing-grid">
      {plans.map((p, i) => {
        const isFeatured = selectedIndex === i;
        return (
          <Reveal key={i} delay={Math.min(i * 70, 420)}>
            <div
              className={`plan ${isFeatured ? 'featured' : ''}`}
              onClick={() => onSelect(i)}
              role="button"
              tabIndex={0}
            >
              {p.badge && <span className="badge">{p.badge}</span>}
              <div className="plan-name">{p.name}</div>
              <div className="price">
                {p.price}
                <span>{p.period}</span>
              </div>
              <div className="price-sub">{p.sub}</div>
              <div className="plan-perk-slot">
                {p.perk && <div className="plan-perk">{p.perk}</div>}
              </div>
              <ul>
                {p.features.map((f, j) => (
                  <li key={j}>{CHECK}{f}</li>
                ))}
              </ul>
              <ContactButton
                message={p.telegramMessage}
                className={`btn ${isFeatured ? 'btn-primary' : 'btn-outline'}`}
              >
                فعّل الآن
              </ContactButton>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
