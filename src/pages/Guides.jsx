import { useTutorials } from '../hooks/useTutorials';
import { useConfig } from '../context/ConfigContext';
import Reveal from '../components/Reveal';

function youtubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

function thumbFor(tutorial) {
  if (tutorial.image_url) return tutorial.image_url;
  const id = youtubeId(tutorial.youtube_url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export default function Guides() {
  const config = useConfig();
  const c = config.copy;
  const { tutorials, loading } = useTutorials();

  return (
    <main>
      <div className="page-hero">
        <div className="wrap">
          <span className="eyebrow"><span className="dot"></span>{c.guidesEyebrow}</span>
          <h1>{c.guidesH1}</h1>
          <p>{c.guidesSub}</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          {loading && <p className="hint">جاري التحميل...</p>}
          {!loading && tutorials.length === 0 && (
            <p className="hint">{c.guidesEmptyState}</p>
          )}

          <div className="guides-grid">
            {tutorials.map((t, i) => {
              const thumb = thumbFor(t);
              return (
                <Reveal key={t.id} delay={Math.min(i * 60, 300)}>
                  <a
                    className="guide-card"
                    href={t.youtube_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="guide-card-thumb">
                      {thumb ? <img src={thumb} alt={t.title} /> : <div className="guide-card-thumb-placeholder">🎬</div>}
                      <span className="guide-card-play">▶</span>
                    </div>
                    <div className="guide-card-title">{t.title}</div>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
