import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Send } from 'lucide-react';

export default function TaskComments({ task, onClose, session }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [task.id]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments/${task.id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setComments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`/api/comments/${task.id}`, { content: newComment }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" style={{zIndex: 100}}>
      <div className="glass-panel modal-content" onClick={e => e.stopPropagation()} style={{display:'flex', flexDirection:'column', height:'80vh'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Comments: {task.title}</h2>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{flexGrow: 1, overflowY: 'auto', marginBottom: '1rem', display:'flex', flexDirection:'column', gap:'1rem'}}>
          {loading ? <div className="loader" style={{margin:'auto'}}></div> : comments.length === 0 ? (
            <p style={{color: 'var(--text-secondary)', textAlign:'center', margin:'auto'}}>No comments yet.</p>
          ) : (
            comments.map(c => (
              <div key={c.id} style={{padding:'1rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px'}}>
                <div style={{fontSize:'0.75rem', color:'var(--text-secondary)', marginBottom:'0.25rem', display:'flex', justifyContent:'space-between'}}>
                  <span>{c.user_email}</span>
                  <span>{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <div style={{fontSize:'0.9rem', color:'white'}}>{c.content}</div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={submitComment} style={{display:'flex', gap:'0.5rem'}}>
          <input 
            type="text" 
            className="input" 
            value={newComment} 
            onChange={e => setNewComment(e.target.value)}
            placeholder="Type a comment..."
          />
          <button type="submit" className="btn btn-primary" disabled={!newComment.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
