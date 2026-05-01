# 🚀 Task Manager Pro

A premium, full-stack Task Management platform built with React, Node.js, and Supabase. Features a dynamic Neon/Glassmorphism UI, a real-time Kanban board, and secure Role-Based Access Control.

## ✨ Features
* **Kanban Drag-and-Drop:** Intuitive 3-column task board (To Do, In Progress, Done).
* **Real-time Syncing:** Powered by Supabase Postgres WebSockets, allowing instant cross-user collaboration.
* **Role-Based Access Control:** Global Admin dashboard versus secure individual user isolation using Row-Level Security (RLS).
* **Dynamic Theme Engine:** Toggle instantly between a sleek Light Mode and a deep-space Neon Dark Mode.
* **Task Comments:** Dedicated real-time chat threads inside every single task.
* **Smart Autocomplete:** Instantly assign tasks to users with native dropdown suggestions.

## 🛠 Tech Stack
* **Frontend:** React, Vite, CSS Custom Properties (Glassmorphism), Lucide Icons
* **Backend:** Node.js, Express
* **Database & Auth:** Supabase PostgreSQL

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/rishav1727/Task-Manager.git
cd Task-Manager

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup
Run the `database_v2.sql` script inside your Supabase SQL Editor to instantly provision your tables, columns, and RLS security policies.

### 3. Environment Variables
You'll need a `.env` file in both your `backend` and `frontend` directories containing your Supabase keys:

**Backend `.env`**
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_EMAIL=your_admin_email@example.com
```

**Frontend `.env`**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ADMIN_EMAIL=your_admin_email@example.com
```

### 4. Run the App
```bash
# Terminal 1 (Backend)
cd backend
npx nodemon index.js

# Terminal 2 (Frontend)
cd frontend
npm run dev
```

---
*Designed & Built by [Rishav](https://github.com/rishav1727)*
