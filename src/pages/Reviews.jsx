import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { useReviews } from '../hooks/useReviews';
import ContactButton from '../components/ContactButton';
import Reveal from '../components/Reveal';

export default function Reviews() {
  const config = useConfig();
  const c = config.copy;
  const { reviews, loading } = useReviews();

  return (
    <main>
      <div className="page-hero">
        <div className="wrap">
          <span className="eyebrow"><span className="dot"></span>{c.reviewsEyebrow}</span>
          <h1>{c.reviewsH1}</h1>
          <p>{c.reviewsSub}</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          {loading && <p className="hint">جاري التحميل...</p>}
          {!loading && reviews.length === 0 && (
            <p className="hint">{c.reviewsEmptyState}</p>
          )}
          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={Math.min(i * 60, 300)}>
                <div className="review-card">
                  <img src={r.image_url} alt={r.caption || 'رأي زبون'} loading="lazy" />
                  {r.caption && <p>{r.caption}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-band">
        <div className="wrap">
          <h2>{c.reviewsCtaHeading}</h2>
          <p>{c.reviewsCtaSub}</p>
          <div className="hero-ctas">
            <ContactButton message={config.messages.trial} className="btn btn-primary btn-lg">
              {c.navTrialBtn}
            </ContactButton>
            <Link to="/pricing" className="btn btn-outline btn-lg">{c.navPricing}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
