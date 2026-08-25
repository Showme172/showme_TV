import { Link } from 'react-router-dom';
import { telegramLink } from '../config';
import { useConfig } from '../context/ConfigContext';
import { SOCIAL_ICONS } from './Icons';
import ShareButton from './ShareButton';

export default function Footer() {
  const config = useConfig();
  const c = config.copy;

  const PAGES = [
    { href: '/', label: c.navHome },
    { href: '/pricing', label: c.navPricing },
    { href: '/reviews', label: c.navReviews },
    { href: '/downloads', label: c.navDownloads },
    { href: '/contact', label: c.navContact },
  ];

  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid footer-grid-3">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <span className="mark"><img src="/logo-icon.png" alt="Showme TV" /></span>
              <span className="logo-text-wrap">
                Showme TV<small>البث والترفيه</small>
              </span>
            </Link>
            <p>{c.footerBrandDesc}</p>
            <div className="socials" aria-label="روابط التواصل الاجتماعي">
              <a href={telegramLink(config.messages.trial)} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                {SOCIAL_ICONS.telegram}
              </a>
              {config.facebookUrl && (
                <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  {SOCIAL_ICONS.facebook}
                </a>
              )}
              {config.whatsappNumber && (
                <a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  {SOCIAL_ICONS.whatsapp}
                </a>
              )}
            </div>
            <ShareButton className="btn btn-outline btn-sm footer-share-btn" />
          </div>

          <div className="footer-col">
            <h4>التنقل</h4>
            <ul>
              {PAGES.map((p) => (
                <li key={p.href}><Link to={p.href}>{p.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>تواصل معنا</h4>
            <ul>
              <li><a href={telegramLink(config.messages.trial)} target="_blank" rel="noopener noreferrer">تيليجرام — @{config.telegramUsername}</a></li>
              {config.whatsappNumber && (
                <li><a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer">واتساب</a></li>
              )}
              {config.facebookUrl && (
                <li><a href={config.facebookUrl} target="_blank" rel="noopener noreferrer">فيسبوك</a></li>
              )}
              <li><a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Showme TV. جميع الحقوق محفوظة.</p>
          <div className="footer-legal">
            <Link to="/terms">شروط الخدمة</Link>
            <Link to="/privacy">سياسة الخصوصية</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
