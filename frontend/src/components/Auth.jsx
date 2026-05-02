import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) throw result.error;

      if (result.data.session) {
        onAuthSuccess(result.data.session);
      } else if (!isLogin) {
        setSuccess('✅ Check your email for the confirmation link!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const guestEmail = 'guest.taskmanager.demo@gmail.com';
      const guestPassword = 'GuestDemo@1234!';

      // Try to sign in first
      let { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: guestEmail,
        password: guestPassword,
      });

      if (signInError) {
        // Account doesn't exist, try signing up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: guestEmail,
          password: guestPassword,
        });
        if (signUpError) throw signUpError;
        data = signUpData;
      }

      if (data?.session) {
        onAuthSuccess(data.session);
      } else {
        setError('Guest login failed. Please disable "Confirm Email" in Supabase Authentication settings, then try again.');
      }
    } catch (err) {
      setError('Guest login failed: ' + err.message);
    } finally {
      setGuestLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
      if (error) throw error;
    } catch (err) {
      setError('GitHub login failed: ' + err.message);
      setGithubLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccess(`✅ Reset link sent to ${email}! Check your inbox.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const svgGitHub = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );

  const svgUser = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  return (
    <div className="auth-container animate-fade-in">
      {/* Animated background blobs */}
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)',
          animation: 'blob1 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(138,43,226,0.1) 0%, transparent 70%)',
          animation: 'blob2 10s ease-in-out infinite'
        }} />
      </div>

      {/* ── FORGOT PASSWORD SCREEN ── */}
      {isForgotPassword ? (
        <div className="glass-panel auth-card" style={{ position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => { setIsForgotPassword(false); setError(null); setSuccess(null); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem',
              marginBottom: '1.5rem', padding: 0, fontFamily: 'inherit'
            }}
          >
            <ArrowLeft size={16} /> Back to login
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 1rem',
              background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-blue))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(138,43,226,0.3)'
            }}>
              <Mail size={28} color="white" />
            </div>
            <h2 className="auth-title">Forgot Password?</h2>
            <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>
          </div>

          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <div style={{
                color: 'var(--danger-color)', fontSize: '0.85rem', marginBottom: '1rem',
                padding: '0.75rem', background: 'rgba(255,51,102,0.1)', borderRadius: '8px',
                border: '1px solid rgba(255,51,102,0.2)', textAlign: 'center'
              }}>{error}</div>
            )}
            {success && (
              <div style={{
                color: 'var(--success-color)', fontSize: '0.85rem', marginBottom: '1rem',
                padding: '0.75rem', background: 'rgba(0,230,118,0.1)', borderRadius: '8px',
                border: '1px solid rgba(0,230,118,0.2)', textAlign: 'center'
              }}>{success}</div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem' }}
              disabled={loading}
            >
              {loading ? <div className="loader" /> : <><Mail size={18} /> Send Reset Link</>}
            </button>
          </form>
        </div>

      ) : (
        {/* Logo/Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(0,240,255,0.3)'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <h2 className="auth-title" style={{ marginBottom: '0.25rem' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>
            {isLogin ? 'Sign in to access your tasks' : 'Sign up to start managing tasks'}
          </p>
        </div>

        {/* Social Login Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={githubLoading || loading || guestLoading}
            className="auth-social-btn"
          >
            {githubLoading ? <div className="loader" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> : svgGitHub}
            <span>{githubLoading ? 'Redirecting...' : 'Continue with GitHub'}</span>
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={guestLoading || loading || githubLoading}
            className="auth-ghost-btn"
          >
            {guestLoading ? <div className="loader" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> : svgUser}
            <span>{guestLoading ? 'Signing in...' : 'Continue as Guest'}</span>
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>or with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
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

          {/* Forgot Password Link */}
          {isLogin && (
            <div style={{ textAlign: 'right', marginTop: '-0.75rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => { setIsForgotPassword(true); setError(null); setSuccess(null); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
                  color: 'var(--text-secondary)', fontFamily: 'inherit', padding: '0.25rem 0',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.target.style.color = 'var(--neon-blue)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >
                Forgot password?
              </button>
            </div>
          )}

          {error && (
            <div style={{
              color: 'var(--danger-color)', fontSize: '0.85rem', marginBottom: '1rem',
              padding: '0.75rem', background: 'rgba(255,51,102,0.1)', borderRadius: '8px',
              border: '1px solid rgba(255,51,102,0.2)', textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              color: 'var(--success-color)', fontSize: '0.85rem', marginBottom: '1rem',
              padding: '0.75rem', background: 'rgba(0,230,118,0.1)', borderRadius: '8px',
              border: '1px solid rgba(0,230,118,0.2)', textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem' }}
            disabled={loading || guestLoading || githubLoading}
          >
            {loading ? (
              <div className="loader" />
            ) : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                {isLogin ? 'Sign In' : 'Sign Up'}
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--neon-blue)', fontWeight: 600, fontSize: '0.875rem',
              fontFamily: 'inherit', padding: '0 0.25rem', textDecoration: 'underline',
              textDecorationColor: 'transparent', transition: 'text-decoration-color 0.2s'
            }}
            onMouseEnter={e => e.target.style.textDecorationColor = 'var(--neon-blue)'}
            onMouseLeave={e => e.target.style.textDecorationColor = 'transparent'}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
        </div>
      )}
    </div>
  );
}
