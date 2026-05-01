const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const verifyToken = require('../middleware/auth');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const isAdmin = (req) => {
  return req.user.email && req.user.email === process.env.ADMIN_EMAIL;
};

// GET all tasks
router.get('/', verifyToken, async (req, res) => {
  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
  
  // If not admin, strictly enforce user isolation
  if (!isAdmin(req)) {
    query = query.eq('user_id', req.user.sub);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// CREATE a task
router.post('/', verifyToken, async (req, res) => {
  const { title, description, status, assign_to_email, priority, due_date } = req.body;
  
  let targetUserId = req.user.sub;
  let targetUserEmail = req.user.email;

  // Admin Assignment Logic
  if (isAdmin(req) && assign_to_email && assign_to_email !== req.user.email) {
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) return res.status(500).json({ error: authError.message });
    
    const targetUser = users.find(u => u.email === assign_to_email);
    if (!targetUser) {
      return res.status(404).json({ message: `User ${assign_to_email} not found. They must sign up first.` });
    }
    targetUserId = targetUser.id;
    targetUserEmail = targetUser.email;
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .insert([
      { 
        title, 
        description, 
        status: status || 'To Do', 
        priority: priority || 'Medium',
        due_date: due_date || null,
        user_id: targetUserId,
        assigned_to: targetUserEmail 
      }
    ])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// UPDATE a task
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date } = req.body;

  let query = supabase.from('tasks').update({ 
    title, 
    description, 
    status, 
    priority, 
    due_date, 
    updated_at: new Date() 
  }).eq('id', id);
  
  // If not admin, verify ownership before updating
  if (!isAdmin(req)) {
    query = query.eq('user_id', req.user.sub);
  }

  const { data, error } = await query.select();

  if (error) return res.status(500).json({ error: error.message });
  if (data.length === 0) return res.status(404).json({ error: 'Task not found or not authorized' });
  res.json(data[0]);
});

// DELETE a task
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  let query = supabase.from('tasks').delete().eq('id', id);
  
  // If not admin, verify ownership before deleting
  if (!isAdmin(req)) {
    query = query.eq('user_id', req.user.sub);
  }

  const { error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Task deleted successfully' });
});

module.exports = router;
