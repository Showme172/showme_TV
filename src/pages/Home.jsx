import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import Ticker from '../components/Ticker';
import FeatureGrid from '../components/FeatureGrid';
import CategoryGrid from '../components/CategoryGrid';
import ContactButton from '../components/ContactButton';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import LiveScoreBanner from '../components/LiveScoreBanner';
import TrustBadges from '../components/TrustBadges';

export default function Home() {
  const config = useConfig();
  const c = config.copy;
  const [visibleFeatures, setVisibleFeatures] = useState(3);
  const [visibleChannels, setVisibleChannels] = useState(3);

  const featuresToShow = config.features.slice(0, visibleFeatures);
  const hasMoreFeatures = visibleFeatures < config.features.length;

  const channelsToShow = config.channelCategories.slice(0, visibleChannels);
  const hasMoreChannels = visibleChannels < config.channelCategories.length;

  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow">
            <span className="dot"></span>بث مباشر — أكثر من 15,000 قناة الآن
          </span>
          <h1>
            {c.heroLine}
            <br />
            <span className="accent">{c.heroAccent}</span>
          </h1>
          <p className="sub">{c.heroSub}</p>
          <div className="hero-ctas">
            <ContactButton message={config.messages.subscribe} className="btn btn-primary btn-lg">
              {c.heroBtnSubscribe}
            </ContactButton>
            <Link to="/pricing" className="btn btn-outline btn-lg">{c.heroBtnPlans}</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><CountUp text="15,000+" /><span>قناة مباشرة</span></div>
            <div className="stat"><CountUp text="200,000+" /><span>فيلم ومسلسل</span></div>
            <div className="stat"><CountUp text="4K" /><span>جودة البث</span></div>
            <div className="stat"><CountUp text="24/7" /><span>دعم مباشر</span></div>
          </div>
          <TrustBadges items={config.trustBadges} />
        </div>
      </section>

      <LiveScoreBanner />
      <Ticker />

      {/* -------- المزايا -------- */}
      <section id="features">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="section-eyebrow">{c.featuresEyebrow}</span>
            <h2>{c.featuresHeading}</h2>
            <p>{c.featuresSub}</p>
          </Reveal>
          <FeatureGrid items={featuresToShow} />
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            {hasMoreFeatures && (
              <button
                className="btn btn-outline"
                onClick={() => setVisibleFeatures((v) => Math.min(v + 3, config.features.length))}
              >
                {c.showMoreLabel}
              </button>
            )}
            {!hasMoreFeatures && visibleFeatures > 3 && (
              <button className="btn btn-outline" onClick={() => setVisibleFeatures(3)}>
                {c.showLessLabel}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* -------- القنوات -------- */}
      <section id="channels" style={{ borderTop: '1px solid var(--border-soft)' }}>
        <div className="wrap">
          <Reveal className="section-head">
            <h2>{c.channelsHeading}</h2>
            <p>{c.channelsSub}</p>
          </Reveal>
          <CategoryGrid categories={channelsToShow} />
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            {hasMoreChannels && (
              <button
                className="btn btn-outline"
                onClick={() => setVisibleChannels((v) => Math.min(v + 3, config.channelCategories.length))}
              >
                {c.showMoreLabel}
              </button>
            )}
            {!hasMoreChannels && visibleChannels > 3 && (
              <button className="btn btn-outline" onClick={() => setVisibleChannels(3)}>
                {c.showLessLabel}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* -------- الأسعار (تيزر) -------- */}
      <section style={{ borderTop: '1px solid var(--border-soft)' }}>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="section-eyebrow">{c.pricingTeaserEyebrow}</span>
            <h2>{c.pricingTeaserHeading}</h2>
            <p>{c.pricingTeaserSub}</p>
          </Reveal>
          <Reveal className="teaser-card">
            <div>
              <div className="price-big">{c.pricingTeaserPrice} <span>{c.pricingTeaserPricePeriod}</span></div>
              <p style={{ color: 'var(--text-dim)', fontSize: 15, marginTop: 8 }}>
                {c.pricingTeaserNote}
              </p>
            </div>
            <Link to="/pricing" className="btn btn-primary btn-lg">{c.pricingTeaserBtn}</Link>
          </Reveal>
        </div>
      </section>

      <div className="cta-band">
        <div className="wrap">
          <h2>{c.ctaHeading}</h2>
          <div className="hero-ctas">
            <ContactButton message={config.messages.trial} className="btn btn-primary btn-lg">
              {c.ctaBtnTrial}
            </ContactButton>
            <Link to="/contact" className="btn btn-outline btn-lg">{c.ctaBtnContact}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
