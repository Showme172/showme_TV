import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useLanguage } from '../context/LanguageContext';

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PK ? loadStripe(STRIPE_PK) : null;

const T = {
  ar: {
    emailLabel: 'الإيميل (لإرسال إيصال الدفع)',
    payingLabel: 'جاري تأكيد الدفع...',
    payNow: 'ادفع الآن',
    secureNote: '🔒 الدفع مشفّر وآمن عبر Stripe',
    paidTitle: 'تم الدفع بنجاح',
    paidBody: 'رح توصلك بيانات حسابك خلال دقائق عبر الإيميل أو تيليجرام.',
    genericPayError: 'صار خطأ أثناء الدفع، جرّب مرة تانية.',
    notConfigured: 'الموقع مش مربوط بقاعدة البيانات بعد.',
    linkNotFound: 'رابط الدفع غير موجود.',
    connError: 'تعذر الاتصال بالخادم، جرّب لاحقاً.',
    loading: 'جاري التحميل...',
    expired: 'رابط الدفع هاد ما عاد صالح. تواصل معنا للحصول على رابط جديد.',
    alreadyPaidTitle: 'هاد الرابط انسدد من قبل',
    alreadyPaidBody: 'إذا في أي استفسار، تواصل معنا.',
    setupIncomplete: 'إعداد الدفع غير مكتمل — تواصل مع الدعم.',
  },
  en: {
    emailLabel: 'Email (to send your payment receipt)',
    payingLabel: 'Confirming payment...',
    payNow: 'Pay Now',
    secureNote: '🔒 Payment is encrypted and secure via Stripe',
    paidTitle: 'Payment Successful',
    paidBody: "You'll receive your account details within minutes via email or Telegram.",
    genericPayError: 'Something went wrong during payment, try again.',
    notConfigured: 'The site is not connected to the database yet.',
    linkNotFound: 'Payment link not found.',
    connError: 'Could not reach the server, try again later.',
    loading: 'Loading...',
    expired: 'This payment link is no longer valid. Contact us for a new one.',
    alreadyPaidTitle: 'This link was already paid',
    alreadyPaidBody: 'If you have any questions, contact us.',
    setupIncomplete: 'Payment setup is incomplete — contact support.',
  },
};

function functionsUrl(name) {
  const base = import.meta.env.VITE_SUPABASE_URL;
  return base ? `${base}/functions/v1/${name}` : null;
}

function formatAmount(amount, currency, lang) {
  try {
    return new Intl.NumberFormat(lang === 'en' ? 'en' : 'ar', { style: 'currency', currency: currency.toUpperCase() }).format(amount);
  } catch {
    return `${amount} ${currency.toUpperCase()}`;
  }
}

function CheckoutForm({ link, t, lang }) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError('');

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        payment_method_data: {
          billing_details: { email: email.trim() || undefined },
        },
      },
    });

    if (submitError) {
      setError(submitError.message || t.genericPayError);
      setSubmitting(false);
      return;
    }

    setDone(true);
    setSubmitting(false);
  }

  if (done) {
    return (
      <div className="pay-success">
        <div className="pay-success-icon">✅</div>
        <h2>{t.paidTitle}</h2>
        <p>{t.paidBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="pay-form">
      <div className="field">
        <label htmlFor="pay-email">{t.emailLabel}</label>
        <input
          id="pay-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <PaymentElement />
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn btn-primary btn-wide" disabled={!stripe || submitting}>
        {submitting ? t.payingLabel : `${t.payNow} — ${formatAmount(link.amount, link.currency, lang)}`}
      </button>
      <p className="pay-secure-note">{t.secureNote}</p>
    </form>
  );
}

export default function PayPage() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const t = T[lang];
  const [state, setState] = useState('loading'); // loading | ready | paid | expired | error
  const [link, setLink] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      const url = functionsUrl('get-payment');
      if (!url) { setState('error'); setErrorMsg(t.notConfigured); return; }

      try {
        const res = await fetch(`${url}?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setState('error');
          setErrorMsg(data.error || t.linkNotFound);
          return;
        }
        setLink(data);
        if (data.status === 'paid') setState('paid');
        else if (data.status !== 'pending' || !data.client_secret) setState('expired');
        else setState('ready');
      } catch {
        setState('error');
        setErrorMsg(t.connError);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const options = useMemo(() => {
    if (!link?.client_secret) return null;
    return { clientSecret: link.client_secret, appearance: STRIPE_APPEARANCE };
  }, [link]);

  return (
    <div className="pay-page">
      <div className="pay-card">
        <img src="/logo.png" alt="Showme TV" className="pay-logo-img" />

        {state === 'loading' && <p className="hint">{t.loading}</p>}

        {state === 'error' && (
          <div className="pay-error">
            <div className="pay-error-icon">⚠️</div>
            <p>{errorMsg}</p>
          </div>
        )}

        {state === 'expired' && (
          <div className="pay-error">
            <div className="pay-error-icon">⏰</div>
            <p>{t.expired}</p>
          </div>
        )}

        {state === 'paid' && (
          <div className="pay-success">
            <div className="pay-success-icon">✅</div>
            <h2>{t.alreadyPaidTitle}</h2>
            <p>{t.alreadyPaidBody}</p>
          </div>
        )}

        {state === 'ready' && link && (
          <>
            <div className="pay-amount-box">
              <span className="pay-amount">{formatAmount(link.amount, link.currency, lang)}</span>
              {link.description && <span className="pay-desc">{link.description}</span>}
            </div>
            {!stripePromise ? (
              <p className="form-error">{t.setupIncomplete}</p>
            ) : (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm link={link} t={t} lang={lang} />
              </Elements>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const STRIPE_APPEARANCE = {
  theme: 'night',
  variables: {
    colorPrimary: '#9B4DFF',
    colorBackground: '#111018',
    colorText: '#F3F2F7',
    colorDanger: '#ff6b81',
    fontFamily: 'Tajawal, sans-serif',
    borderRadius: '10px',
  },
};
