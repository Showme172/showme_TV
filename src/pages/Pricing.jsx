import { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Link } from 'react-router-dom';
import PricingGrid from '../components/PricingGrid';
import ContactButton from '../components/ContactButton';
import Faq from '../components/Faq';

export default function Pricing() {
  const config = useConfig();
  const c = config.copy;
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const initial = config.plans.findIndex((p) => p.featured);
    setSelectedIndex(initial >= 0 ? initial : null);
  }, [config.plans]);

  return (
    <main>
      <div className="page-hero">
        <div className="wrap">
          <span className="eyebrow"><span className="dot"></span>{c.pricingEyebrow}</span>
          <h1>{c.pricingH1}</h1>
        </div>
      </div>

      <section>
        <div className="wrap">
          <PricingGrid plans={config.plans} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
        </div>
      </section>

      <section style={{ borderTop: '1px solid var(--border-soft)' }}>
        <div className="wrap">
          <div className="section-head">
            <span className="section-eyebrow">{c.pricingFaqEyebrow}</span>
            <h2>{c.pricingFaqHeading}</h2>
            <p>{c.pricingFaqSub}</p>
          </div>
          <Faq items={config.faq} />
        </div>
      </section>

      <div className="cta-band">
        <div className="wrap">
          <h2>{c.pricingCtaHeading}</h2>
          <p>{c.pricingCtaSub}</p>
          <div className="hero-ctas">
            <ContactButton message={config.messages.activate} className="btn btn-primary btn-lg">
              {c.pricingCtaBtn}
            </ContactButton>
            <Link to="/contact" className="btn btn-outline btn-lg">{c.navContact}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
