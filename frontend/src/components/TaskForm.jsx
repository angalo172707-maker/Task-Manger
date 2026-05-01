import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Check } from 'lucide-react';

export default function TaskForm({ onClose, onTaskCreated, session, isAdmin }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignToEmail, setAssignToEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    if (isAdmin) {
      axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      .then(res => setAvailableUsers(res.data))
      .catch(err => console.error('Failed to load users:', err));
    }
  }, [isAdmin, session.access_token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/tasks`, {
        title,
        description,
        status,
        priority,
        due_date: dueDate || null,
        assign_to_email: assignToEmail
      }, {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      onTaskCreated(response.data);
      onClose();
    } catch (err) {
      console.error('Failed to create task:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      alert(`Error: ${errorMsg}. (Make sure you ran the database.sql script!)`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Create New Task</h2>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Design homepage"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Detailed explanation of the task..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              className="input" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              style={{ appearance: 'none' }}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div style={{display:'flex', gap:'1rem'}}>
            <div className="form-group" style={{flex: 1}}>
              <label className="form-label">Priority</label>
              <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group" style={{flex: 1}}>
              <label className="form-label">Due Date (Optional)</label>
              <input 
                type="date" 
                className="input" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {isAdmin && (
            <div className="form-group">
              <label className="form-label">Assign To User (Email)</label>
              <input
                type="email"
                className="input"
                list="user-emails"
                value={assignToEmail}
                onChange={(e) => setAssignToEmail(e.target.value)}
                placeholder="Leave blank to assign to yourself"
                autoComplete="off"
              />
              <datalist id="user-emails">
                {availableUsers.map(email => (
                  <option key={email} value={email} />
                ))}
              </datalist>
            </div>
          )}

          <div className="flex-row">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <div className="loader"></div> : <><Check size={16} /> Save Task</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
