const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Task Management API');
});

// Import routes
const taskRoutes = require('./routes/tasks');
const commentsRoutes = require('./routes/comments');
const usersRoutes = require('./routes/users');

app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/users', usersRoutes);

// --- PRODUCTION DEPLOYMENT SETUP ---
// Serve frontend build files in production
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
