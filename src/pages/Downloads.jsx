import { useState } from 'react';
import { useApps } from '../hooks/useApps';
import { useConfig } from '../context/ConfigContext';
import { useLanguage } from '../context/LanguageContext';
import Reveal from '../components/Reveal';

const T = {
  ar: {
    download: 'تحميل', downloadStarted: '✓ بدأ التحميل', loading: 'جاري التحميل...',
    platformsLabel: 'منصات التطبيقات', appCount: 'تطبيق',
    noApps: 'لا توجد تطبيقات مضافة لهذه المنصة حالياً.', recommended: '⭐ ننصح فيه',
    version: 'الإصدار', downloaderCode: 'كود Downloader:', guide: 'الشرح',
  },
  en: {
    download: 'Download', downloadStarted: '✓ Download started', loading: 'Loading...',
    platformsLabel: 'App platforms', appCount: 'app',
    noApps: 'No apps added for this platform yet.', recommended: '⭐ Recommended',
    version: 'Version', downloaderCode: 'Downloader code:', guide: 'Guide',
  },
};

function DownloadButton({ url, t }) {
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
      <span className="download-btn-label">{t.download}</span>
      <span className="download-btn-check">{t.downloadStarted}</span>
    </a>
  );
}

export default function Downloads() {
  const config = useConfig();
  const c = config.copy;
  const { lang } = useLanguage();
  const t = T[lang];
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
          {loading && <p className="hint">{t.loading}</p>}
          <div className="platform-slider" dir="ltr">
            <div className="platform-tabs" role="tablist" aria-label={t.platformsLabel}>
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
                  <small>{appsForPlatform(platform.id).length} {t.appCount}</small>
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
                          <p className="hint platform-empty">{t.noApps}</p>
                        ) : (
                          <div className="apps-grid">
                            {platformApps.map((app, i) => (
                              <Reveal key={app.id} delay={Math.min(i * 60, 300)}>
                                <div className={`app-card ${app.is_recommended ? 'app-card-recommended' : ''}`}>
                                  {app.is_recommended && <span className="app-recommended-badge">{t.recommended}</span>}
                                  {app.icon_url ? (
                                    <img className="app-icon" src={app.icon_url} alt={app.name} />
                                  ) : (
                                    <div className="app-icon app-icon-placeholder">📺</div>
                                  )}
                                  <div className="app-info">
                                    <h3>{app.name}</h3>
                                    {app.version && <span className="app-version">{t.version} {app.version}</span>}
                                    {app.downloader_code && (
                                      <span className="app-downloader-code">{t.downloaderCode} <b>{app.downloader_code}</b></span>
                                    )}
                                  </div>
                                  <DownloadButton url={app.download_url} t={t} />
                                  {app.tutorial_url && (
                                    <a href={app.tutorial_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                      {t.guide}
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
