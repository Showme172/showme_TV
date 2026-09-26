import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Downloads from './pages/Downloads';
import Guides from './pages/Guides';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Admin from './pages/admin/Admin';
import AnnouncementPopup from './components/AnnouncementPopup';
import LiveChat from './components/LiveChat';
import PayPage from './pages/PayPage';
import BootIntro from './components/BootIntro';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const pathname = useLocation().pathname;
  const isAdmin = pathname.startsWith('/admin');
  const isPay = pathname.startsWith('/pay');

  return (
    <>
      <BootIntro />
      <div className="grain-bg"></div>
      <div className="grid-overlay"></div>
      <ScrollToTop />
      {!isPay && <Header />}
      <div key={pathname} className="page-transition">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/downloads" element={<Downloads />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/pay/:id" element={<PayPage />} />
          {/* روابط قديمة — بتحوّل تلقائياً حتى لو حدا عنده رابط محفوظ */}
          <Route path="/features" element={<Navigate to="/#features" replace />} />
          <Route path="/channels" element={<Navigate to="/#channels" replace />} />
          <Route path="/support" element={<Navigate to="/contact" replace />} />
        </Routes>
      </div>
      {!isPay && <Footer />}
      {!isAdmin && !isPay && <AnnouncementPopup />}
      {!isAdmin && !isPay && <LiveChat />}
    </>
  );
}
