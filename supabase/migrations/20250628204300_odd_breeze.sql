/*
  # VoiceForPeace Database Schema

  1. New Tables
    - `profiles` - User profiles and preferences
    - `stories` - Humanitarian stories and content
    - `donations` - Donation tracking and transparency
    - `quests` - Daily quests and gamification
    - `leaderboard` - Community leaderboard tracking
    - `voice_generations` - AI voice generation history
    - `video_generations` - AI video generation history
    - `projects` - Humanitarian projects and campaigns
    - `comments` - User comments and interactions
    - `story_likes` - Story likes and engagement

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Features
    - Real-time subscriptions for community features
    - Automated quest completion tracking
    - Donation transparency and verification
    - User engagement analytics
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE story_urgency AS ENUM ('low', 'medium', 'high');
CREATE TYPE story_category AS ENUM ('education', 'healthcare', 'food', 'shelter', 'emergency');
CREATE TYPE quest_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE donation_status AS ENUM ('pending', 'confirmed', 'failed');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'user',
  tokens integer DEFAULT 0,
  level integer DEFAULT 1,
  total_donations numeric DEFAULT 0,
  stories_listened integer DEFAULT 0,
  quests_completed integer DEFAULT 0,
  preferred_language text DEFAULT 'en',
  notification_preferences jsonb DEFAULT '{"email": true, "push": true}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  character_name text NOT NULL,
  character_age integer,
  location text NOT NULL,
  urgency story_urgency DEFAULT 'medium',
  category story_category NOT NULL,
  image_url text,
  audio_url text,
  video_url text,
  is_premium boolean DEFAULT false,
  is_published boolean DEFAULT false,
  listeners_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  language text DEFAULT 'en',
  project_id uuid,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  category story_category NOT NULL,
  funding_goal numeric DEFAULT 0,
  current_funding numeric DEFAULT 0,
  beneficiaries_count integer DEFAULT 0,
  image_url text,
  is_active boolean DEFAULT true,
  algorand_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  project_id uuid REFERENCES projects(id),
  amount numeric NOT NULL,
  currency text DEFAULT 'ALGO',
  transaction_id text,
  blockchain_hash text,
  status donation_status DEFAULT 'pending',
  message text,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz
);

-- Quests table
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty quest_difficulty DEFAULT 'easy',
  reward_tokens integer DEFAULT 0,
  requirements jsonb DEFAULT '{}',
  is_daily boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User quest completions
CREATE TABLE IF NOT EXISTS user_quest_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  quest_id uuid REFERENCES quests(id),
  completed_at timestamptz DEFAULT now(),
  tokens_earned integer DEFAULT 0,
  UNIQUE(user_id, quest_id, DATE(completed_at))
);

-- Leaderboard entries
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  period text NOT NULL, -- 'daily', 'weekly', 'monthly', 'all_time'
  tokens integer DEFAULT 0,
  level integer DEFAULT 1,
  rank integer,
  period_start timestamptz,
  period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, period, period_start)
);

-- Voice generations tracking
CREATE TABLE IF NOT EXISTS voice_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  story_id uuid REFERENCES stories(id),
  voice_id text NOT NULL,
  text_content text NOT NULL,
  audio_url text,
  language text DEFAULT 'en',
  voice_settings jsonb DEFAULT '{}',
  generation_time_ms integer,
  created_at timestamptz DEFAULT now()
);

-- Video generations tracking
CREATE TABLE IF NOT EXISTS video_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  story_id uuid REFERENCES stories(id),
  character_name text NOT NULL,
  video_url text,
  thumbnail_url text,
  duration_seconds integer,
  language text DEFAULT 'en',
  generation_time_ms integer,
  created_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  story_id uuid REFERENCES stories(id),
  content text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Story likes
CREATE TABLE IF NOT EXISTS story_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  story_id uuid REFERENCES stories(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, story_id)
);

-- Add foreign key constraint for stories -> projects
ALTER TABLE stories ADD CONSTRAINT fk_stories_project 
  FOREIGN KEY (project_id) REFERENCES projects(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_urgency ON stories(urgency);
CREATE INDEX IF NOT EXISTS idx_stories_published ON stories(is_published);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_project_id ON donations(project_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON leaderboard_entries(period, period_start);
CREATE INDEX IF NOT EXISTS idx_voice_generations_user_id ON voice_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_video_generations_user_id ON video_generations(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Stories policies
CREATE POLICY "Anyone can read published stories"
  ON stories FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Users can read own stories"
  ON stories FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create stories"
  ON stories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Projects policies
CREATE POLICY "Anyone can read active projects"
  ON projects FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Donations policies
CREATE POLICY "Users can read own donations"
  ON donations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create donations"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Quests policies
CREATE POLICY "Anyone can read active quests"
  ON quests FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User quest completions policies
CREATE POLICY "Users can read own quest completions"
  ON user_quest_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quest completions"
  ON user_quest_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Leaderboard policies
CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard_entries FOR SELECT
  TO authenticated
  USING (true);

-- Voice generations policies
CREATE POLICY "Users can read own voice generations"
  ON voice_generations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create voice generations"
  ON voice_generations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Video generations policies
CREATE POLICY "Users can read own video generations"
  ON video_generations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create video generations"
  ON video_generations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can read approved comments"
  ON comments FOR SELECT
  TO authenticated
  USING (is_approved = true);

CREATE POLICY "Users can read own comments"
  ON comments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Story likes policies
CREATE POLICY "Users can read story likes"
  ON story_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own likes"
  ON story_likes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Functions for automated tasks

-- Function to update story listeners count
CREATE OR REPLACE FUNCTION increment_story_listeners(story_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE stories 
  SET listeners_count = listeners_count + 1,
      updated_at = now()
  WHERE id = story_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update story likes count
CREATE OR REPLACE FUNCTION update_story_likes_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE stories 
    SET likes_count = likes_count + 1,
        updated_at = now()
    WHERE id = NEW.story_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE stories 
    SET likes_count = likes_count - 1,
        updated_at = now()
    WHERE id = OLD.story_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for story likes count
CREATE TRIGGER story_likes_count_trigger
  AFTER INSERT OR DELETE ON story_likes
  FOR EACH ROW EXECUTE FUNCTION update_story_likes_count();

-- Function to update user profile on quest completion
CREATE OR REPLACE FUNCTION update_profile_on_quest_completion()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles 
  SET tokens = tokens + NEW.tokens_earned,
      quests_completed = quests_completed + 1,
      level = GREATEST(level, (tokens + NEW.tokens_earned) / 1000 + 1),
      updated_at = now()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for quest completion
CREATE TRIGGER quest_completion_trigger
  AFTER INSERT ON user_quest_completions
  FOR EACH ROW EXECUTE FUNCTION update_profile_on_quest_completion();

-- Function to update project funding
CREATE OR REPLACE FUNCTION update_project_funding()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE projects 
    SET current_funding = current_funding + NEW.amount,
        updated_at = now()
    WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for donation confirmation
CREATE TRIGGER donation_confirmation_trigger
  AFTER UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_project_funding();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user signup
CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();