/*
  # Seed Initial Data for VoiceForPeace

  This migration adds initial data for:
  - Sample humanitarian projects
  - Sample stories
  - Daily quests
  - Sample leaderboard data
*/

-- Insert sample projects
INSERT INTO projects (id, title, description, location, category, funding_goal, current_funding, beneficiaries_count, image_url, algorand_address) VALUES
  (
    'gaza-education',
    'Gaza Education Initiative',
    'Supporting children''s education in Gaza through digital learning platforms and school reconstruction',
    'Gaza',
    'education',
    50000,
    32000,
    1200,
    'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=400',
    'GAZA7EDUCATION7PROJECT7ALGORAND7ADDRESS7HERE'
  ),
  (
    'syria-healthcare',
    'Syrian Healthcare Support',
    'Providing medical supplies and healthcare services to displaced families in refugee camps',
    'Syria',
    'healthcare',
    75000,
    45000,
    2500,
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    'SYRIA7HEALTHCARE7PROJECT7ALGORAND7ADDRESS7HERE'
  ),
  (
    'ukraine-culture',
    'Ukraine Cultural Preservation',
    'Preserving Ukrainian culture and supporting displaced artists through digital platforms',
    'Ukraine',
    'education',
    30000,
    28000,
    800,
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    'UKRAINE7CULTURE7PROJECT7ALGORAND7ADDRESS7HERE'
  ),
  (
    'lebanon-food',
    'Lebanon Food Security',
    'Emergency food distribution for refugee families and vulnerable communities',
    'Lebanon',
    'food',
    40000,
    15000,
    1800,
    'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400',
    'LEBANON7FOOD7PROJECT7ALGORAND7ADDRESS7HERE'
  ),
  (
    'yemen-emergency',
    'Yemen Emergency Relief',
    'Critical humanitarian aid for conflict-affected communities including medical care and shelter',
    'Yemen',
    'emergency',
    100000,
    25000,
    5000,
    'https://images.pexels.com/photos/6647019/pexels-photo-6647019.jpeg?auto=compress&cs=tinysrgb&w=400',
    'YEMEN7EMERGENCY7PROJECT7ALGORAND7ADDRESS7HERE'
  );

-- Insert sample stories
INSERT INTO stories (id, title, content, character_name, character_age, location, urgency, category, image_url, is_premium, is_published, listeners_count, likes_count, language, project_id) VALUES
  (
    gen_random_uuid(),
    'Mariam''s Educational Journey',
    'My name is Mariam, and I''m 10 years old. Even though our school was damaged, we never stopped learning. My teacher, Miss Fatima, started teaching us under the olive tree in our neighborhood. She says education is like water - it finds a way to flow even through the smallest cracks. Every morning, I walk past the rubble with my notebook clutched tight to my chest. The other children and I sit in a circle, sharing the few books we have left. We practice writing in the sand when we run out of paper. Miss Fatima tells us stories of children around the world who go to beautiful schools with libraries full of books. She promises that one day, we''ll have that too. Until then, we keep learning, because hope grows strongest in the hardest ground.',
    'Mariam',
    10,
    'Gaza',
    'high',
    'education',
    'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=400',
    false,
    true,
    2847,
    156,
    'en',
    'gaza-education'
  ),
  (
    gen_random_uuid(),
    'Dr. Ahmed''s Medical Mission',
    'I am Ahmed, a father of three beautiful children. Before the conflict, I was a doctor at Damascus General Hospital. Now, I work in a makeshift clinic in a refugee camp, treating families with whatever supplies we can find. Every day, I see the resilience of the human spirit. Mothers who walk miles to bring their sick children to us. Elderly people who share their last bit of medicine with strangers. Children who draw pictures of their dreams on the walls of our tent clinic. We may have lost our homes, but we haven''t lost our humanity. With each patient I treat, with each life we save, we''re rebuilding not just bodies, but hope itself. The international community''s support gives us the strength to continue healing, one person at a time.',
    'Ahmed',
    34,
    'Syria',
    'medium',
    'healthcare',
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    true,
    true,
    1923,
    89,
    'en',
    'syria-healthcare'
  ),
  (
    gen_random_uuid(),
    'Elena''s Cultural Resistance',
    'My name is Elena, and I''m a folk dancer from Kyiv. When the war started, I thought our cultural traditions might be lost forever. But something beautiful happened - artists from all over Ukraine began gathering in safe spaces, determined to keep our heritage alive. We teach traditional dances to children in shelters, sing folk songs that have been passed down for generations, and create art that tells our story. Every performance is an act of resistance, every song a declaration that our culture will survive. International supporters have helped us set up mobile cultural centers, bringing music and art to displaced families. Through dance and song, we''re not just preserving our past - we''re creating hope for our future.',
    'Elena',
    28,
    'Ukraine',
    'high',
    'education',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    true,
    true,
    3421,
    203,
    'en',
    'ukraine-culture'
  );

-- Insert daily quests
INSERT INTO quests (title, description, difficulty, reward_tokens, requirements, is_daily, is_active) VALUES
  (
    'Share a Story',
    'Share a humanitarian story on social media to raise awareness',
    'easy',
    50,
    '{"action": "share_story", "count": 1}',
    true,
    true
  ),
  (
    'Make a Donation',
    'Donate to any humanitarian project using ALGO cryptocurrency',
    'medium',
    100,
    '{"action": "donate", "min_amount": 5}',
    true,
    true
  ),
  (
    'Listen to Stories',
    'Listen to 3 different humanitarian stories using AI voice narration',
    'easy',
    25,
    '{"action": "listen_stories", "count": 3}',
    true,
    true
  ),
  (
    'Community Engagement',
    'Like and comment on community stories to show support',
    'easy',
    30,
    '{"action": "engage", "likes": 5, "comments": 2}',
    true,
    true
  ),
  (
    'Create Awareness Content',
    'Create and share awareness content about humanitarian causes',
    'hard',
    150,
    '{"action": "create_content", "type": "meme_or_post"}',
    false,
    true
  ),
  (
    'Weekly Donation Goal',
    'Contribute to reaching the weekly community donation goal',
    'medium',
    75,
    '{"action": "weekly_donation", "min_amount": 10}',
    false,
    true
  );

-- Insert sample leaderboard data (this would normally be generated by user activity)
-- Note: In production, this would be populated by actual user data
INSERT INTO leaderboard_entries (user_id, period, tokens, level, rank, period_start, period_end) VALUES
  -- These are placeholder UUIDs - in production they would reference real users
  (gen_random_uuid(), 'all_time', 15420, 24, 1, '2024-01-01'::timestamptz, null),
  (gen_random_uuid(), 'all_time', 12890, 21, 2, '2024-01-01'::timestamptz, null),
  (gen_random_uuid(), 'all_time', 8934, 16, 3, '2024-01-01'::timestamptz, null),
  (gen_random_uuid(), 'all_time', 7621, 14, 4, '2024-01-01'::timestamptz, null),
  (gen_random_uuid(), 'all_time', 6543, 12, 5, '2024-01-01'::timestamptz, null);

-- Create a view for easy leaderboard access
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
  le.rank,
  p.full_name,
  p.tokens,
  p.level,
  le.period,
  le.period_start,
  le.period_end
FROM leaderboard_entries le
JOIN profiles p ON le.user_id = p.user_id
WHERE le.period = 'all_time'
ORDER BY le.rank ASC;

-- Create a view for project statistics
CREATE OR REPLACE VIEW project_stats AS
SELECT 
  p.*,
  COUNT(d.id) as total_donations,
  COUNT(s.id) as story_count,
  ROUND((p.current_funding / p.funding_goal * 100), 2) as funding_percentage
FROM projects p
LEFT JOIN donations d ON p.id = d.project_id AND d.status = 'confirmed'
LEFT JOIN stories s ON p.id = s.project_id AND s.is_published = true
GROUP BY p.id;

-- Create a view for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  p.*,
  COUNT(DISTINCT d.id) as donations_made,
  COUNT(DISTINCT uqc.id) as quests_completed_count,
  COUNT(DISTINCT sl.id) as stories_liked,
  COUNT(DISTINCT vg.id) as voice_generations_count
FROM profiles p
LEFT JOIN donations d ON p.user_id = d.user_id
LEFT JOIN user_quest_completions uqc ON p.user_id = uqc.user_id
LEFT JOIN story_likes sl ON p.user_id = sl.user_id
LEFT JOIN voice_generations vg ON p.user_id = vg.user_id
GROUP BY p.id;