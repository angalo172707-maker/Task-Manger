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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
