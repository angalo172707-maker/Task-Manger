import { Code2, Database, Code, Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-panel" style={{ 
      marginTop: '4rem',
      marginBottom: '1rem',
      padding: '2rem 3rem',
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      {/* Top Row: Split into two sides */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        
        {/* Left Side: Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Task Manager Pro
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Enterprise-grade task tracking and team collaboration.
          </p>
        </div>

        {/* Right Side: GitHub Button */}
        <a 
          href="https://github.com/rishav1727/Task-Manager" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            padding: '0.6rem 1.25rem',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'var(--neon-blue)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Code2 size={18} />
          View Source Code
        </a>
      </div>

      <div style={{ height: '1px', background: 'var(--border-color)', width: '100%' }}></div>

      {/* Bottom Row: Tech Stack & Copyright */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Tech Stack Badges */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '0.35rem 0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <Code size={12} color="var(--neon-blue)" /> React UI
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '0.35rem 0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <Zap size={12} color="var(--warning-color)" /> Node API
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '0.35rem 0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <Database size={12} color="var(--success-color)" /> Supabase DB
          </span>
        </div>

        {/* Copyright */}
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          &copy; {currentYear} • Designed & Built by <strong style={{ color: 'var(--text-primary)' }}>Rishav</strong>
        </div>
      </div>
    </footer>
  );
}
