import { useLiveScores } from '../hooks/useLiveScores';
import { useLanguage } from '../context/LanguageContext';

const ARIA_LABEL = { ar: 'مباريات مباشرة الآن', en: 'Live matches now' };

export default function LiveScoreBanner() {
  const { scores, isLive, loading } = useLiveScores();
  const { lang } = useLanguage();

  if (loading || !isLive || scores.length === 0) return null;

  return (
    <div className="live-score-band" aria-label={ARIA_LABEL[lang]}>
      <div className="wrap">
        <div className="live-score-track">
          {scores.map((m, i) => (
            <div className="live-score-card" key={i}>
              <span className="live-score-league">{m.league}</span>
              <div className="live-score-teams">
                <span>{m.home}</span>
                <span className="live-score-result">
                  {m.homeScore} - {m.awayScore}
                </span>
                <span>{m.away}</span>
              </div>
              <span className="live-score-minute">
                <span className="live"></span>
                {m.minute ? `${m.minute}'` : m.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
