import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { Trash2, ShieldAlert, MessageCircle, Clock } from 'lucide-react';
import TaskComments from './TaskComments';

export default function TaskList({ session, isAdmin }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [activeCommentTask, setActiveCommentTask] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchTasks();
    
    // Set up Realtime listener
    let filterParams = isAdmin ? undefined : 'user_id=eq.' + session.user.id;
    
    const channel = supabase.channel('tasks_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: filterParams }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTasks(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
        } else if (payload.eventType === 'DELETE') {
          setTasks(prev => prev.filter(t => t.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session, isAdmin]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.status === newStatus) return;
    try {
      await axios.put(`${API_URL}/api/tasks/${id}`, { ...task, status: newStatus }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, status);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader"></div></div>;

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div>
      {/* Search and Filters */}
      <div style={{display:'flex', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap'}}>
        <input 
          type="text" 
          className="input" 
          placeholder="Search tasks..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{flex: 1, minWidth: '250px'}}
        />
        <select className="input" value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{width: '200px'}}>
          <option value="All">All Priorities</option>
          <option value="High">🔴 High Priority</option>
          <option value="Medium">🟡 Medium Priority</option>
          <option value="Low">🟢 Low Priority</option>
        </select>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {columns.map(status => (
          <div 
            key={status} 
            className="glass-panel" 
            style={{ padding: '1rem', minHeight: '60vh', display:'flex', flexDirection:'column' }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              {status} 
              <span className="status-badge" style={{background: 'rgba(255,255,255,0.1)'}}>
                {filteredTasks.filter(t => t.status === status).length}
              </span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
              {filteredTasks.filter(t => t.status === status).map(task => {
                const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Done';
                
                return (
                  <div 
                    key={task.id} 
                    className="task-card glass-panel" 
                    style={{ 
                      cursor: 'grab', 
                      padding: '1.25rem',
                      borderLeft: `4px solid ${task.priority === 'High' ? 'var(--danger-color)' : task.priority === 'Medium' ? '#f5a623' : '#7ed321'}`,
                      borderColor: isOverdue ? 'var(--danger-color)' : ''
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                  >
                    <div className="task-header">
                      <h4 className="task-title" style={{fontSize: '1rem'}}>{task.title}</h4>
                      <button className="btn-ghost" style={{padding:'0.25rem'}} onClick={() => handleDelete(task.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <p className="task-desc" style={{fontSize: '0.85rem', marginBottom: '1rem'}}>{task.description}</p>
                    
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto', borderTop:'1px solid var(--border-color)', paddingTop:'0.75rem', flexWrap:'wrap', gap:'0.5rem'}}>
                      {task.due_date && (
                        <div style={{
                          fontSize: '0.75rem', 
                          display:'flex', 
                          alignItems:'center', 
                          gap:'0.25rem', 
                          color: isOverdue ? 'var(--danger-color)' : 'var(--text-primary)',
                          fontWeight: isOverdue ? 'bold' : 'normal'
                        }}>
                          <Clock size={12} /> {new Date(task.due_date).toLocaleDateString()} {isOverdue && '(Overdue)'}
                        </div>
                      )}
                      
                      <button className="btn-ghost" style={{padding:'0.25rem', display:'flex', alignItems:'center', gap:'0.25rem', fontSize:'0.75rem'}} onClick={() => setActiveCommentTask(task)}>
                        <MessageCircle size={14} /> Comments
                      </button>
                    </div>

                    {isAdmin && task.assigned_to && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop:'0.5rem', display:'flex', alignItems:'center', gap:'0.25rem' }}>
                        <ShieldAlert size={12} /> {task.assigned_to}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {activeCommentTask && (
        <TaskComments task={activeCommentTask} session={session} onClose={() => setActiveCommentTask(null)} />
      )}
    </div>
  );
}
