import { createContext, useContext, useState } from 'react';
import { useConfig } from './ConfigContext';
import { telegramLink, whatsappLink } from '../config';
import { SOCIAL_ICONS } from '../components/Icons';

const ContactContext = createContext({ openContact: () => {} });

export function ContactProvider({ children }) {
  const config = useConfig();
  const [message, setMessage] = useState(null);

  function openContact(msg) {
    setMessage(msg);
  }

  function close() {
    setMessage(null);
  }

  function pick(kind) {
    const url = kind === 'telegram' ? telegramLink(message) : whatsappLink(message);
    window.open(url, '_blank', 'noopener');
    close();
  }

  return (
    <ContactContext.Provider value={{ openContact }}>
      {children}
      {message && (
        <div className="contact-modal-overlay" onClick={close}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <button className="contact-modal-close" onClick={close} aria-label="إغلاق">✕</button>
            <h3>وين بتفضّل تحكي معنا؟</h3>
            <div className="contact-modal-options">
              <button className="contact-modal-btn telegram" onClick={() => pick('telegram')}>
                {SOCIAL_ICONS.telegram}
                تيليجرام
              </button>
              {config.whatsappNumber && (
                <button className="contact-modal-btn whatsapp" onClick={() => pick('whatsapp')}>
                  {SOCIAL_ICONS.whatsapp}
                  واتساب
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </ContactContext.Provider>
  );
}

export function useContact() {
  return useContext(ContactContext);
}
