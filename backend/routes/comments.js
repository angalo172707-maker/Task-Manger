const express = require('express');
const router = express.Router(); 
const { createClient } = require('@supabase/supabase-js');
const verifyToken = require('../middleware/auth');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const isAdmin = (req) => {
  return req.user.email && req.user.email === process.env.ADMIN_EMAIL;
};

// GET comments for a specific task
router.get('/:taskId', verifyToken, async (req, res) => {
  const { taskId } = req.params;
  
  if (!isAdmin(req)) {
    const { data: task } = await supabase.from('tasks').select('id').eq('id', taskId).eq('user_id', req.user.sub).single();
    if (!task) return res.status(403).json({ error: 'Not authorized' });
  }

  const { data, error } = await supabase.from('comments').select('*').eq('task_id', taskId).order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST a comment to a task
router.post('/:taskId', verifyToken, async (req, res) => {
  const { taskId } = req.params;
  const { content } = req.body;

  if (!isAdmin(req)) {
    const { data: task } = await supabase.from('tasks').select('id').eq('id', taskId).eq('user_id', req.user.sub).single();
    if (!task) return res.status(403).json({ error: 'Not authorized' });
  }

  const { data, error } = await supabase.from('comments').insert([{
    task_id: taskId,
    user_id: req.user.sub,
    user_email: req.user.email,
    content
  }]).select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

module.exports = router;
