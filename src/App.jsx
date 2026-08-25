import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import Downloads from './pages/Downloads';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Admin from './pages/admin/Admin';
import AnnouncementPopup from './components/AnnouncementPopup';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const isAdmin = useLocation().pathname.startsWith('/admin');

  return (
    <>
      <div className="grain-bg"></div>
      <div className="grid-overlay"></div>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin" element={<Admin />} />
        {/* روابط قديمة — بتحوّل تلقائياً حتى لو حدا عنده رابط محفوظ */}
        <Route path="/features" element={<Navigate to="/#features" replace />} />
        <Route path="/channels" element={<Navigate to="/#channels" replace />} />
        <Route path="/support" element={<Navigate to="/contact" replace />} />
      </Routes>
      <Footer />
      {!isAdmin && <LiveChat />}
      {!isAdmin && <AnnouncementPopup />}
    </>
  );
}
