import { useApps } from '../hooks/useApps';
import { useConfig } from '../context/ConfigContext';
import Reveal from '../components/Reveal';

export default function Downloads() {
  const config = useConfig();
  const c = config.copy;
  const { apps, loading } = useApps();

  return (
    <main>
      <div className="page-hero">
        <div className="wrap">
          <span className="eyebrow"><span className="dot"></span>{c.downloadsEyebrow}</span>
          <h1>{c.downloadsH1}</h1>
          <p>{c.downloadsSub}</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          {loading && <p className="hint">جاري التحميل...</p>}
          {!loading && apps.length === 0 && (
            <p className="hint">{c.downloadsEmptyState}</p>
          )}
          <div className="apps-grid">
            {apps.map((app, i) => (
              <Reveal key={app.id} delay={Math.min(i * 60, 300)}>
                <div className="app-card">
                  {app.icon_url ? (
                    <img className="app-icon" src={app.icon_url} alt={app.name} />
                  ) : (
                    <div className="app-icon app-icon-placeholder">📺</div>
                  )}
                  <div className="app-info">
                    <h3>{app.name}</h3>
                    {app.version && <span className="app-version">الإصدار {app.version}</span>}
                    {app.downloader_code && (
                      <span className="app-downloader-code">كود Downloader: <b>{app.downloader_code}</b></span>
                    )}
                  </div>
                  <a href={app.download_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    تحميل
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
