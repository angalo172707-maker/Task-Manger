import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { X, Send, Users, User } from 'lucide-react';

export default function Chat({ session, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // null means Global Chat
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_API_URL || '';
  const currentUserId = session?.user?.id;
  const currentUserEmail = session?.user?.email;
  const GUEST_EMAIL = 'guest.taskmanager.demo@gmail.com';
  const isGuest = currentUserEmail === GUEST_EMAIL;

  useEffect(() => {
    // Guests cannot see user list — only global chat
    if (isGuest) return;
    axios.get(`${API_URL}/api/users/public`, {
      headers: { Authorization: `Bearer ${session.access_token}` }
    })
    .then(res => {
      // Exclude self and the guest account
      setUsers(res.data.filter(u => u.id !== currentUserId && u.email !== GUEST_EMAIL));
    })
    .catch(err => console.error('Failed to load users for chat:', err));
  }, [session.access_token, API_URL, currentUserId, isGuest]);

  useEffect(() => {
    fetchMessages();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
        const msg = payload.new;
        if (selectedUser === null) {
          // Global chat mode
          if (msg.receiver_id === null) {
            setMessages(prev => [...prev, msg]);
          }
        } else {
          // Direct message mode
          if (
            (msg.sender_id === currentUserId && msg.receiver_id === selectedUser.id) ||
            (msg.sender_id === selectedUser.id && msg.receiver_id === currentUserId)
          ) {
            setMessages(prev => [...prev, msg]);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser, currentUserId]);

  const fetchMessages = async () => {
    setLoading(true);
    let query = supabase.from('chat_messages').select('*').order('created_at', { ascending: true });
    
    if (selectedUser === null) {
      query = query.is('receiver_id', null);
    } else {
      query = query.or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUserId})`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgData = {
      sender_id: currentUserId,
      sender_email: currentUserEmail,
      receiver_id: selectedUser ? selectedUser.id : null,
      receiver_email: selectedUser ? selectedUser.email : null,
      content: newMessage.trim(),
    };

    setNewMessage(''); // optimistic clear
    const { error } = await supabase.from('chat_messages').insert([msgData]);
    if (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container glass-panel animate-fade-in" style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      height: '600px',
      maxHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      padding: 0,
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {selectedUser ? <User size={18} color="var(--neon-purple)" /> : <Users size={18} color="var(--neon-blue)" />}
          {selectedUser ? selectedUser.email.split('@')[0] : 'Global Chat'}
        </h3>
        <button className="btn-ghost" onClick={onClose} style={{ padding: '0.2rem' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar — hidden for guest users */}
        {!isGuest && (
          <div style={{
            width: '120px',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <button 
              onClick={() => setSelectedUser(null)}
              style={{
                padding: '0.75rem 0.5rem',
                background: selectedUser === null ? 'var(--neon-blue-transparent)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-color)',
                color: selectedUser === null ? 'var(--neon-blue)' : 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.85rem',
                fontWeight: selectedUser === null ? 600 : 400
              }}
            >
              # Global
            </button>
            
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {users.map(u => (
                <button 
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    background: selectedUser?.id === u.id ? 'var(--neon-purple-transparent)' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--border-color)',
                    color: selectedUser?.id === u.id ? 'var(--neon-purple)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    fontSize: '0.8rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={u.email}
                >
                  {u.email.split('@')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="chat-messages" style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-secondary)' }}>Loading...</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                No messages yet. Start chatting!
              </div>
            ) : (
              messages.map(msg => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div key={msg.id} style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: isMe ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isMe ? 'var(--neon-blue)' : 'var(--border-color)'}`,
                    borderRadius: '12px',
                    padding: '0.5rem 0.75rem',
                    borderBottomRightRadius: isMe ? 0 : '12px',
                    borderBottomLeftRadius: isMe ? '12px' : 0
                  }}>
                    {!isMe && selectedUser === null && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--neon-purple)', marginBottom: '0.2rem', fontWeight: 600 }}>
                        {isGuest
                          ? `User #${msg.sender_id.slice(0, 4).toUpperCase()}`
                          : msg.sender_email.split('@')[0]
                        }
                      </div>
                    )}
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                      {msg.content}
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} style={{
            padding: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.5rem',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="input"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem', minWidth: '40px', justifyContent: 'center' }} disabled={!newMessage.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
