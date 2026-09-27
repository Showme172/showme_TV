import { useLanguage } from '../context/LanguageContext';

const CHANNELS = {
  ar: [
    { num: '101', name: 'الرياضة الأولى HD', live: true },
    { num: '102', name: 'سينما بريميوم 4K' },
    { num: '103', name: 'الأخبار 24' },
    { num: '104', name: 'عالم الأطفال' },
    { num: '105', name: 'عالم الوثائقيات' },
    { num: '106', name: 'الموسيقى المباشرة', live: true },
    { num: '107', name: 'أكشن ماكس' },
    { num: '108', name: 'مركز المسلسلات' },
    { num: '109', name: 'قناة الطبخ' },
    { num: '110', name: 'الرياضة العالمية', live: true },
  ],
  en: [
    { num: '101', name: 'Sports One HD', live: true },
    { num: '102', name: 'Cinema Premium 4K' },
    { num: '103', name: 'News 24' },
    { num: '104', name: 'Kids World' },
    { num: '105', name: 'Documentary World' },
    { num: '106', name: 'Live Music', live: true },
    { num: '107', name: 'Action Max' },
    { num: '108', name: 'Series Hub' },
    { num: '109', name: 'Cooking Channel' },
    { num: '110', name: 'World Sports', live: true },
  ],
};

const LIVE_LABEL = { ar: 'مباشر', en: 'LIVE' };
const ARIA_LABEL = { ar: 'نماذج من القنوات المباشرة', en: 'Sample live channels' };

function ChannelSet({ channels, liveLabel }) {
  return (
    <>
      {channels.map((c, i) => (
        <span className="chan" key={i}>
          <span className="num">{c.num}</span>
          <span>{c.name}</span>
          {c.live && <span className="live">{liveLabel}</span>}
        </span>
      ))}
    </>
  );
}

export default function Ticker() {
  const { lang } = useLanguage();
  const channels = CHANNELS[lang];
  const liveLabel = LIVE_LABEL[lang];

  return (
    <div className="ticker-band" aria-label={ARIA_LABEL[lang]}>
      <div className="ticker-track">
        <ChannelSet channels={channels} liveLabel={liveLabel} />
        <ChannelSet channels={channels} liveLabel={liveLabel} />
      </div>
    </div>
  );
}
