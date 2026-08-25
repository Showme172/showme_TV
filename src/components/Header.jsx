import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import ContactButton from './ContactButton';

export default function Header() {
  const config = useConfig();
  const c = config.copy;
  const [menuOpen, setMenuOpen] = useState(false);

  const PAGES = [
    { href: '/', label: c.navHome },
    { href: '/pricing', label: c.navPricing },
    { href: '/reviews', label: c.navReviews },
    { href: '/downloads', label: c.navDownloads },
    { href: '/contact', label: c.navContact },
  ];

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header>
      <div className="wrap nav">
        <NavLink to="/" className="logo" onClick={closeMenu}>
          <span className="mark"><img src="/logo-icon.png" alt="Showme TV" /></span>
          <span className="logo-text-wrap">
            Showme TV<small>البث والترفيه</small>
          </span>
        </NavLink>

        <nav className="nav-links">
          {PAGES.map((p) => (
            <NavLink key={p.href} to={p.href} end={p.href === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {p.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-cta">
          <ContactButton message={config.messages.trial} className="btn btn-outline btn-sm">
            {c.navTrialBtn}
          </ContactButton>
          <ContactButton message={config.messages.activate} className="btn btn-primary btn-sm">
            {c.navActivateBtn}
          </ContactButton>
        </div>

        <button
          className={`mobile-menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="القائمة"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-menu-links">
            {PAGES.map((p) => (
              <NavLink
                key={p.href}
                to={p.href}
                end={p.href === '/'}
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {p.label}
              </NavLink>
            ))}
          </nav>
          <div className="mobile-menu-cta">
            <ContactButton message={config.messages.trial} className="btn btn-outline">
              {c.navTrialBtn}
            </ContactButton>
            <ContactButton message={config.messages.activate} className="btn btn-primary">
              {c.navActivateBtn}
            </ContactButton>
          </div>
        </div>
      )}
    </header>
  );
}
