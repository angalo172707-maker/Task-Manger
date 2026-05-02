const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const verifyToken = require('../middleware/auth');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const isAdmin = (req) => {
  return req.user.email && req.user.email === process.env.ADMIN_EMAIL;
};

// GET all registered users (Admin only)
router.get('/', verifyToken, async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ error: 'Not authorized to view users' });
  }

  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) return res.status(500).json({ error: error.message });
  
  // Return just the emails
  const emails = users.map(u => u.email);
  res.json(emails);
});

// GET all users for chat (Accessible to all authenticated users)
router.get('/public', verifyToken, async (req, res) => {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) return res.status(500).json({ error: error.message });
  
  // Return ids and emails
  const publicUsers = users.map(u => ({ id: u.id, email: u.email }));
  res.json(publicUsers);
});

module.exports = router;
