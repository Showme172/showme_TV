import { useState } from 'react';
import { useApps } from '../hooks/useApps';
import { useConfig } from '../context/ConfigContext';
import Reveal from '../components/Reveal';

function DownloadButton({ url }) {
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    setClicked(true);
    setTimeout(() => setClicked(false), 1400);
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-primary btn-sm download-btn ${clicked ? 'is-clicked' : ''}`}
      onClick={handleClick}
    >
      <span className="download-btn-label">تحميل</span>
      <span className="download-btn-check">✓ بدأ التحميل</span>
    </a>
  );
}

export default function Downloads() {
  const config = useConfig();
  const c = config.copy;
  const { apps, loading } = useApps();
  const [activePlatform, setActivePlatform] = useState('android');
  const platforms = [
    { id: 'android', label: 'Android', logo: '/platforms/android.svg' },
    { id: 'smart_tv', label: 'Smart TV', logo: '/platforms/smart-tv.svg' },
    { id: 'iphone', label: 'iPhone', logo: '/platforms/apple.svg' },
    { id: 'windows', label: 'Windows', logo: '/platforms/windows.svg' },
  ];

  function appsForPlatform(platform) {
    return apps.filter((app) => (app.platform || 'android') === platform);
  }

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
          <div className="platform-slider" dir="ltr">
            <div className="platform-tabs" role="tablist" aria-label="منصات التطبيقات">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  className={`platform-tab ${activePlatform === platform.id ? 'active' : ''}`}
                  onClick={() => setActivePlatform(platform.id)}
                  role="tab"
                  aria-selected={activePlatform === platform.id}
                >
                  <span className="platform-tab-icon" aria-hidden="true">
                    <img src={platform.logo} alt="" />
                  </span>
                  <span>{platform.label}</span>
                  <small>{appsForPlatform(platform.id).length} تطبيق</small>
                </button>
              ))}
            </div>

            <div className="platform-viewport">
              <div className="platform-track" style={{ transform: `translateX(-${platforms.findIndex((platform) => platform.id === activePlatform) * 25}%)` }}>
                {platforms.map((platform) => {
                  const platformApps = appsForPlatform(platform.id);
                  const isActive = activePlatform === platform.id;
                  return (
                    <div className="platform-panel" key={platform.id} role="tabpanel">
                      <div
                        className={`platform-panel-inner ${isActive ? 'is-active' : ''}`}
                        key={isActive ? `${platform.id}-active` : platform.id}
                      >
                        {platformApps.length === 0 ? (
                          <p className="hint platform-empty">لا توجد تطبيقات مضافة لهذه المنصة حالياً.</p>
                        ) : (
                          <div className="apps-grid">
                            {platformApps.map((app, i) => (
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
                                  <DownloadButton url={app.download_url} />
                                  {app.tutorial_url && (
                                    <a href={app.tutorial_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                      الشرح
                                    </a>
                                  )}
                                </div>
                              </Reveal>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
