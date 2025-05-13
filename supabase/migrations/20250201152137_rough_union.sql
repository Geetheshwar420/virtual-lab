/*
  # Initial Schema Setup for Crypto Lab

  1. Tables
    - Safely create `user_progress` and `quiz_results` if they don't exist
    - Add RLS policies
  
  2. Security
    - Enable RLS
    - Add user-specific policies
*/

-- Create tables if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_progress') THEN
    CREATE TABLE user_progress (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users NOT NULL,
      algorithm_id text NOT NULL,
      progress integer DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(user_id, algorithm_id)
    );
  END IF;

  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'quiz_results') THEN
    CREATE TABLE quiz_results (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users NOT NULL,
      quiz_id text NOT NULL,
      score integer NOT NULL,
      completed_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS (safe to run multiple times)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
  -- user_progress policies
  DROP POLICY IF EXISTS "Users can read own progress" ON user_progress;
  DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
  DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
  
  -- quiz_results policies
  DROP POLICY IF EXISTS "Users can read own quiz results" ON quiz_results;
  DROP POLICY IF EXISTS "Users can insert own quiz results" ON quiz_results;
END $$;

-- Recreate policies
CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);