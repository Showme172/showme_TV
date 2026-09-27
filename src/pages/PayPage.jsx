import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PK ? loadStripe(STRIPE_PK) : null;

function functionsUrl(name) {
  const base = import.meta.env.VITE_SUPABASE_URL;
  return base ? `${base}/functions/v1/${name}` : null;
}

function formatAmount(amount, currency) {
  try {
    return new Intl.NumberFormat('ar', { style: 'currency', currency: currency.toUpperCase() }).format(amount);
  } catch {
    return `${amount} ${currency.toUpperCase()}`;
  }
}

function CheckoutForm({ link }) {
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
      setError(submitError.message || 'صار خطأ أثناء الدفع، جرّب مرة تانية.');
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
        <h2>تم الدفع بنجاح</h2>
        <p>رح توصلك بيانات حسابك خلال دقائق عبر الإيميل أو تيليجرام.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="pay-form">
      <div className="field">
        <label htmlFor="pay-email">الإيميل (لإرسال إيصال الدفع)</label>
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
        {submitting ? 'جاري تأكيد الدفع...' : `ادفع الآن — ${formatAmount(link.amount, link.currency)}`}
      </button>
      <p className="pay-secure-note">🔒 الدفع مشفّر وآمن عبر Stripe</p>
    </form>
  );
}

export default function PayPage() {
  const { id } = useParams();
  const [state, setState] = useState('loading'); // loading | ready | paid | expired | error
  const [link, setLink] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      const url = functionsUrl('get-payment');
      if (!url) { setState('error'); setErrorMsg('الموقع مش مربوط بقاعدة البيانات بعد.'); return; }

      try {
        const res = await fetch(`${url}?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setState('error');
          setErrorMsg(data.error || 'رابط الدفع غير موجود.');
          return;
        }
        setLink(data);
        if (data.status === 'paid') setState('paid');
        else if (data.status !== 'pending' || !data.client_secret) setState('expired');
        else setState('ready');
      } catch {
        setState('error');
        setErrorMsg('تعذر الاتصال بالخادم، جرّب لاحقاً.');
      }
    })();
  }, [id]);

  const options = useMemo(() => {
    if (!link?.client_secret) return null;
    return { clientSecret: link.client_secret, appearance: STRIPE_APPEARANCE };
  }, [link]);

  return (
    <div className="pay-page">
      <div className="pay-card">
        <img src="/logo.png" alt="Showme TV" className="pay-logo-img" />

        {state === 'loading' && <p className="hint">جاري التحميل...</p>}

        {state === 'error' && (
          <div className="pay-error">
            <div className="pay-error-icon">⚠️</div>
            <p>{errorMsg}</p>
          </div>
        )}

        {state === 'expired' && (
          <div className="pay-error">
            <div className="pay-error-icon">⏰</div>
            <p>رابط الدفع هاد ما عاد صالح. تواصل معنا للحصول على رابط جديد.</p>
          </div>
        )}

        {state === 'paid' && (
          <div className="pay-success">
            <div className="pay-success-icon">✅</div>
            <h2>هاد الرابط انسدد من قبل</h2>
            <p>إذا في أي استفسار، تواصل معنا.</p>
          </div>
        )}

        {state === 'ready' && link && (
          <>
            <div className="pay-amount-box">
              <span className="pay-amount">{formatAmount(link.amount, link.currency)}</span>
              {link.description && <span className="pay-desc">{link.description}</span>}
            </div>
            {!stripePromise ? (
              <p className="form-error">إعداد الدفع غير مكتمل — تواصل مع الدعم.</p>
            ) : (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm link={link} />
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
