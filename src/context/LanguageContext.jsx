import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({ lang: 'ar', toggleLang: () => {}, setLang: () => {} });

function getInitialLang() {
  try {
    const saved = localStorage.getItem('showme_lang');
    if (saved === 'en' || saved === 'ar') return saved;
  } catch { /* localStorage غير متاح */ }
  return 'ar';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    try { localStorage.setItem('showme_lang', lang); } catch { /* noop */ }
  }, [lang]);

  function setLang(next) {
    setLangState(next === 'en' ? 'en' : 'ar');
  }
  function toggleLang() {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
