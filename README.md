# 🗂️ Task Manager — Full Stack Application

A modern, full-stack **Task Management** application with real-time collaboration, team chat, and multiple authentication options.

![Task Manager](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-19-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-orange)

---

## ✨ Features

### 🔐 Authentication
- **Email / Password** login and registration
- **Sign in with GitHub** (OAuth)
- **Continue as Guest** — instant access without registration
- **Forgot Password** — email-based password reset flow
- Show/hide password toggle

### 📋 Task Management
- **Kanban Board** with three columns: `To Do`, `In Progress`, `Done`
- **Drag & Drop** tasks between columns
- **Priority Levels** — High 🔴, Medium 🟡, Low 🟢
- **Due Dates** with overdue detection
- **Task Comments** — discussion per task
- **Admin Panel** — assign tasks to any registered user
- **Real-time Updates** — changes reflect instantly via Supabase Realtime

### 💬 Real-Time Chat
- **Global Chat** — open channel for all users
- **Direct Messages** — private one-on-one messaging with any user
- **Guest Privacy Mode** — guests cannot see real user names or send direct messages; sender names are anonymized as `User #XXXX`
- Instant delivery via Supabase Realtime subscriptions

### 🎨 UI/UX
- **Dark / Light Mode** toggle
- **Glassmorphism** design with neon accents
- **Animated background blobs** on the login page
- **Glitter trail** cursor effect
- **Smooth hover effects** on all interactive elements
- Fully **responsive** layout

---

## 🗃️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router |
| **Styling** | Vanilla CSS (Glassmorphism + Neon theme) |
| **Backend** | Node.js, Express |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Email, GitHub OAuth) |
| **Real-time** | Supabase Realtime |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A GitHub OAuth App (for GitHub login)

### 1. Clone the repository
```bash
git clone https://github.com/angalo172707-maker/Task-Manger.git
cd Task-Manger
```

### 2. Setup the Database
Run each SQL file in your **Supabase SQL Editor** in order:

1. `database.sql` — Creates the `tasks` table
2. `database_v2.sql` — Adds `comments` table, `priority` & `due_date` columns
3. `database_v3.sql` — Adds `chat_messages` table for real-time chat

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=your_admin_email@example.com
```

Start the backend:
```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
VITE_ADMIN_EMAIL=your_admin_email@example.com
```

Start the frontend:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔧 Supabase Configuration

### Enable GitHub OAuth
1. Go to **Authentication → Providers → GitHub**
2. Toggle **Enabled**
3. Paste your GitHub OAuth App **Client ID** and **Client Secret**

### Allow Password Reset Redirects
1. Go to **Authentication → URL Configuration**
2. Add `http://localhost:5173` to **Redirect URLs**
3. Add your production URL when deploying

### Create Guest Account
1. Go to **Authentication → Users → Add User → Create New User**
2. Email: `guest.taskmanager.demo@gmail.com`
3. Password: `GuestDemo@1234!`
4. ✅ Check **Auto Confirm User**

### Disable Email Confirmation (for instant login)
1. Go to **Authentication → Providers → Email**
2. Toggle **Confirm email** to **OFF**

---

## 📁 Project Structure

```
Task-Manager/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT verification via Supabase
│   ├── routes/
│   │   ├── tasks.js         # CRUD for tasks
│   │   ├── comments.js      # Task comments
│   │   └── users.js         # User listing (admin + public)
│   ├── index.js             # Express entry point
│   └── .env.example
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Auth.jsx         # Login, Signup, Forgot Password
│       │   ├── ResetPassword.jsx# Set new password page
│       │   ├── Navbar.jsx       # Top navigation bar
│       │   ├── TaskList.jsx     # Kanban board
│       │   ├── TaskForm.jsx     # Create task modal
│       │   ├── TaskComments.jsx # Task comment thread
│       │   ├── Chat.jsx         # Real-time chat panel
│       │   ├── GlitterTrail.jsx # Cursor glitter effect
│       │   └── Footer.jsx
│       ├── lib/
│       │   └── supabase.js      # Supabase client
│       ├── App.jsx
│       └── index.css            # Global styles & design system
│
├── database.sql         # v1 schema
├── database_v2.sql      # v2 schema (comments, priority, due date)
└── database_v3.sql      # v3 schema (chat messages)
```

---

## 👤 Admin vs User Roles

| Capability | Admin | Regular User | Guest |
|---|---|---|---|
| View own tasks | ✅ | ✅ | ✅ |
| View ALL tasks | ✅ | ❌ | ❌ |
| Create tasks | ✅ | ✅ | ❌ |
| Assign to others | ✅ | ❌ | ❌ |
| Delete any task | ✅ | Own only | ❌ |
| Global Chat | ✅ | ✅ | ✅ (anonymous) |
| Direct Messages | ✅ | ✅ | ❌ |
| See user list | ✅ | ✅ | ❌ |

---

## 📜 License

MIT © 2026
