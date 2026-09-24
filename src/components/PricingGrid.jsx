import Reveal from './Reveal';
import { CHECK } from './Icons';
import ContactButton from './ContactButton';
import AnimatedPrice from './AnimatedPrice';
import { useInView } from '../hooks/useInView';

function PlanCard({ p, isFeatured, onSelect }) {
  const [priceRef, priceInView] = useInView();

  function handleTilt(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translateY(-6px) scale(1.025) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
  }
  function resetTilt(e) {
    e.currentTarget.style.transform = '';
  }

  return (
    <div
      className={`plan ${isFeatured ? 'featured' : ''}`}
      onClick={onSelect}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
      role="button"
      tabIndex={0}
    >
      {p.badge && <span className="badge">{p.badge}</span>}
      <div className="plan-name">{p.name}</div>
      <div className="price" ref={priceRef}>
        <AnimatedPrice value={p.price} active={priceInView} />
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
  );
}

export default function PricingGrid({ plans, selectedIndex, onSelect }) {
  return (
    <div className="pricing-grid">
      {plans.map((p, i) => {
        const isFeatured = selectedIndex === i;
        return (
          <Reveal key={i} delay={Math.min(i * 70, 420)}>
            <PlanCard p={p} isFeatured={isFeatured} onSelect={() => onSelect(i)} />
          </Reveal>
        );
      })}
    </div>
  );
}
