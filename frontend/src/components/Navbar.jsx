import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, Plus, Shield, Sun, Moon, MessageSquare } from 'lucide-react';

export default function Navbar({ session, onLogout, onNewTask, onToggleChat, theme, toggleTheme }) {
  const email = session?.user?.email;
  const isAdmin = email === import.meta.env.VITE_ADMIN_EMAIL;

  return (
    <nav className="nav-bar glass-panel" style={{ margin: '1rem', borderRadius: '16px' }}>
      <div className="nav-brand">
        <LayoutDashboard size={24} color="var(--neon-blue)" />
        Task Manager
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {isAdmin && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(138, 43, 226, 0.15)', border: '1px solid var(--neon-purple)', borderRadius: '9999px', color: 'var(--neon-purple)' }}>
            <Shield size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>ADMIN</span>
          </div>
        )}
      
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {email}
        </span>
        
        <button className="btn btn-primary" onClick={onNewTask}>
          <Plus size={16} />
          New Task
        </button>

        <button className="btn btn-secondary" onClick={onToggleChat} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
          background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--neon-blue)',
          color: 'var(--neon-blue)', borderRadius: '8px', cursor: 'pointer'
        }}>
          <MessageSquare size={16} />
          Chat
        </button>
        
        <button className="btn btn-danger" onClick={onLogout}>
          <LogOut size={16} />
          Logout
        </button>

        <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }}></div>

        {/* Dynamic Theme Toggle Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', width: '75px', textAlign: 'right' }}>
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <div 
            style={{
              width: '56px', height: '30px', 
              background: theme === 'dark' ? 'var(--neon-blue)' : '#d1d1d6', 
              borderRadius: '15px', 
              position: 'relative', 
              transition: 'background 0.3s ease',
              boxShadow: theme === 'dark' ? '0 0 10px rgba(0,240,255,0.4)' : 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              position: 'absolute', top: '3px', left: theme === 'dark' ? '29px' : '3px', 
              width: '24px', height: '24px', 
              background: '#ffffff', borderRadius: '50%', 
              transition: 'left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
              {theme === 'dark' ? <Moon size={14} color="#1a1a1a" /> : <Sun size={14} color="#f5a623" />}
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}
