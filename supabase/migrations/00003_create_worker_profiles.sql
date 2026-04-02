CREATE TABLE worker_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  headline        TEXT,
  bio             TEXT,
  years_experience INTEGER DEFAULT 0,
  rate_min        INTEGER,
  rate_max        INTEGER,
  rate_type       TEXT CHECK (rate_type IN ('hourly', 'daily', 'project')) DEFAULT 'daily',
  is_available    BOOLEAN DEFAULT TRUE,
  portfolio_urls  TEXT[],
  verified        BOOLEAN DEFAULT FALSE,
  avg_rating      NUMERIC(3,2) DEFAULT 0,
  review_count    INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE worker_skills (
  id                SERIAL PRIMARY KEY,
  worker_profile_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
  skill_category_id INTEGER REFERENCES skill_categories(id) ON DELETE CASCADE,
  UNIQUE(worker_profile_id, skill_category_id)
);

ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Worker profiles are viewable by everyone" ON worker_profiles
  FOR SELECT USING (true);

CREATE POLICY "Workers can insert own profile" ON worker_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Workers can update own profile" ON worker_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Worker skills viewable by everyone" ON worker_skills
  FOR SELECT USING (true);

CREATE POLICY "Workers can manage own skills" ON worker_skills
  FOR ALL USING (
    worker_profile_id IN (SELECT id FROM worker_profiles WHERE user_id = auth.uid())
  );
