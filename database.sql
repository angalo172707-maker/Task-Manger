-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create a table for tasks
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'To Do' CHECK (status IN ('To Do', 'In Progress', 'Done')),
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to create tasks
CREATE POLICY "Users can create tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own tasks
CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own tasks
CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime for the tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
