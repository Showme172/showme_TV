import { Link } from 'react-router-dom';

import { telegramLink } from '../config';
import { useConfig } from '../context/ConfigContext';
import { useLanguage } from '../context/LanguageContext';
import { SOCIAL_ICONS } from './Icons';
import ShareButton from './ShareButton';

const T = {
  ar: {
    socialsLabel: 'روابط التواصل الاجتماعي',
    nav: 'التنقل', contact: 'تواصل معنا',
    telegram: 'تيليجرام', whatsapp: 'واتساب', facebook: 'فيسبوك',
    rights: 'جميع الحقوق محفوظة.',
    terms: 'شروط الخدمة', privacy: 'سياسة الخصوصية',
  },
  en: {
    socialsLabel: 'Social media links',
    nav: 'Navigation', contact: 'Contact Us',
    telegram: 'Telegram', whatsapp: 'WhatsApp', facebook: 'Facebook',
    rights: 'All rights reserved.',
    terms: 'Terms of Service', privacy: 'Privacy Policy',
  },
};

export default function Footer() {
  const config = useConfig();
  const c = config.copy;
  const { lang } = useLanguage();
  const t = T[lang];

  const PAGES = [
    { href: '/', label: c.navHome },
    { href: '/pricing', label: c.navPricing },
    { href: '/downloads', label: c.navDownloads },
    { href: '/contact', label: c.navContact },
  ];

  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid footer-grid-3">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <img className="brand-logo" src="/logo.png" alt="Showme TV" />
            </Link>
            <p>{c.footerBrandDesc}</p>
            <div className="socials" aria-label={t.socialsLabel}>
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
            <h4>{t.nav}</h4>
            <ul>
              {PAGES.map((p) => (
                <li key={p.href}><Link to={p.href}>{p.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t.contact}</h4>
            <ul>
              <li><a href={telegramLink(config.messages.trial)} target="_blank" rel="noopener noreferrer">{t.telegram} — @{config.telegramUsername}</a></li>
              {config.whatsappNumber && (
                <li><a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer">{t.whatsapp}</a></li>
              )}
              {config.facebookUrl && (
                <li><a href={config.facebookUrl} target="_blank" rel="noopener noreferrer">{t.facebook}</a></li>
              )}
              <li><a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Showme TV. {t.rights}</p>
          <div className="footer-legal">
            <Link to="/terms">{t.terms}</Link>
            <Link to="/privacy">{t.privacy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
