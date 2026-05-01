import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import GlitterTrail from './components/GlitterTrail';
import Footer from './components/Footer';

function App() {
  const [session, setSession] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const isAdmin = session?.user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <Auth onAuthSuccess={setSession} />;
  }

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <GlitterTrail />
      <Navbar 
        session={session} 
        onLogout={handleLogout} 
        onNewTask={() => setShowTaskForm(true)} 
        theme={theme}
        toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      
      <main style={{ flexGrow: 1 }}>
        <TaskList session={session} isAdmin={isAdmin} />
      </main>

      <Footer />

      {showTaskForm && (
        <TaskForm 
          session={session} 
          isAdmin={isAdmin}
          onClose={() => setShowTaskForm(false)} 
          onTaskCreated={() => {
            setShowTaskForm(false);
            // The TaskList will automatically refresh via realtime subscription
          }} 
        />
      )}
    </div>
  );
}

export default App;
