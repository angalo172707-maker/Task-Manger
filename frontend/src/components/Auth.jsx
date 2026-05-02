import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Github } from 'lucide-react';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
        setError('Check your email for the confirmation link.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const email = 'guest@taskmanager.local';
      const password = 'guest1234Secure!';

      // Try to sign in first
      let { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // If it fails (likely because it doesn't exist), try signing up
        const signUpResult = await supabase.auth.signUp({ email, password });
        if (signUpResult.error) throw signUpResult.error;
        data = signUpResult.data;
      }

      if (data?.session) {
        onAuthSuccess(data.session);
      } else {
        setError('Guest login requires email confirmation to be disabled in Supabase, or the account needs to be verified.');
      }
    } catch (err) {
      setError('Guest login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      });
      if (error) throw error;
      // The page will redirect to GitHub, so we don't handle onAuthSuccess here.
    } catch (err) {
      setError('GitHub login failed: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass-panel auth-card">
        <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to access your tasks' : 'Sign up to start managing tasks'}
        </p>

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
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ color: 'var(--danger-color)', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.75rem', marginBottom: '0.75rem' }}
            disabled={loading}
          >
            {loading ? (
              <div className="loader"></div>
            ) : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                {isLogin ? 'Sign In' : 'Sign Up'}
              </>
            )}
          </button>

          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', marginBottom: '0.75rem' }}
            disabled={loading}
            onClick={handleGithubLogin}
          >
            {loading ? <div className="loader"></div> : <><Github size={18} /> Continue with GitHub</>}
          </button>

          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)' }}
            disabled={loading}
            onClick={handleGuestLogin}
          >
            {loading ? <div className="loader"></div> : 'Continue as Guest'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            type="button" 
            className="btn-ghost" 
            style={{ padding: '0.25rem 0.5rem', border: 'none', cursor: 'pointer' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
