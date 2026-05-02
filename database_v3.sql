-- Run this SQL in your Supabase SQL Editor to add Chat features

-- Create the chat_messages table
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_email TEXT NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL means it's a global chat message
  receiver_email TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow users to view messages if they sent it, received it, or if it's a global message
CREATE POLICY "View chat messages" ON chat_messages
  FOR SELECT USING (
    receiver_id IS NULL OR 
    sender_id = auth.uid() OR 
    receiver_id = auth.uid() OR
    (auth.jwt() ->> 'email') = 'angalo172707@gmail.com' -- Admin can view all messages
  );

-- Allow users to insert messages
CREATE POLICY "Insert chat messages" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
  );

-- Enable Realtime for the chat_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
