import { useState } from 'react';
import Reveal from './Reveal';
import { CHEVRON } from './Icons';

export default function Faq({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <Reveal key={i} delay={Math.min(i * 60, 300)}>
            <div className={`faq-item ${isOpen ? 'open' : ''}`}>
              <div className="faq-q" onClick={() => setOpenIndex(isOpen ? null : i)}>
                <span>{item.q}</span>
                {CHEVRON}
              </div>
              <div className="faq-a">
                <p>{item.a}</p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
