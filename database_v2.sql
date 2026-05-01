-- Run this in your Supabase SQL Editor to add the new features

-- 1. Add new columns to the tasks table
ALTER TABLE tasks ADD COLUMN due_date DATE;
ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High'));

-- 2. Create the comments table
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Turn on Security for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies for comments
CREATE POLICY "View comments" ON comments
  FOR SELECT USING (
    (auth.jwt() ->> 'email') = 'angalo172707@gmail.com'
    OR task_id IN (SELECT id FROM tasks WHERE user_id = auth.uid())
  );

CREATE POLICY "Insert comments" ON comments
  FOR INSERT WITH CHECK (
    (auth.jwt() ->> 'email') = 'angalo172707@gmail.com'
    OR task_id IN (SELECT id FROM tasks WHERE user_id = auth.uid())
  );

-- 5. Enable Realtime for comments
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
