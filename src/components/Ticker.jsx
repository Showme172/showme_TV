const CHANNELS = [
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
];

function ChannelSet() {
  return (
    <>
      {CHANNELS.map((c, i) => (
        <span className="chan" key={i}>
          <span className="num">{c.num}</span>
          <span>{c.name}</span>
          {c.live && <span className="live">مباشر</span>}
        </span>
      ))}
    </>
  );
}

export default function Ticker() {
  return (
    <div className="ticker-band" aria-label="نماذج من القنوات المباشرة">
      <div className="ticker-track">
        <ChannelSet />
        <ChannelSet />
      </div>
    </div>
  );
}
