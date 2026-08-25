import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin({ onLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError('بيانات الدخول غير صحيحة، أو الحساب مو مفعّل بعد.');
      return;
    }
    onLoggedIn(data.session);
  }

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="logo" style={{ marginBottom: 24 }}>
          <span className="mark"><img src="/logo-icon.png" alt="Showme TV" /></span>
          <span className="logo-text-wrap">Showme TV<small>لوحة التحكم</small></span>
        </div>
        <div className="field">
          <label>البريد الإلكتروني</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>كلمة السر</label>
          <div className="password-field-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'إخفاء كلمة السر' : 'إظهار كلمة السر'}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </div>
        {error && <p className="admin-login-error">{error}</p>}
        <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
      </form>
    </div>
  );
}
