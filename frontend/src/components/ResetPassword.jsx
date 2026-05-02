import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, KeyRound, Check } from 'lucide-react';

export default function ResetPassword({ onDone }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        onDone();
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container animate-fade-in">
        <div className="glass-panel auth-card" style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1.5rem',
            background: 'rgba(0, 230, 118, 0.15)', border: '2px solid var(--success-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Check size={32} color="var(--success-color)" />
          </div>
          <h2 className="auth-title" style={{ color: 'var(--success-color)' }}>Password Updated!</h2>
          <p className="auth-subtitle">Your password has been changed successfully. Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass-panel auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(138,43,226,0.3)'
          }}>
            <KeyRound size={28} color="white" />
          </div>
          <h2 className="auth-title">Set New Password</h2>
          <p className="auth-subtitle">Enter and confirm your new password below.</p>
        </div>

        <form onSubmit={handleReset}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              style={{ paddingRight: '3rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '0.75rem', top: '60%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
                padding: '0.25rem', display: 'flex', alignItems: 'center'
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
            />
          </div>

          {error && (
            <div style={{
              color: 'var(--danger-color)', fontSize: '0.85rem', marginBottom: '1rem',
              padding: '0.75rem', background: 'rgba(255,51,102,0.1)', borderRadius: '8px',
              border: '1px solid rgba(255,51,102,0.2)', textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? <div className="loader" /> : <><KeyRound size={18} /> Update Password</>}
          </button>
        </form>
      </div>
    </div>
  );
}
