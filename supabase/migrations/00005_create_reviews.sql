CREATE TABLE reviews (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_profile_id UUID NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  author_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating            SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title             TEXT,
  body              TEXT,
  is_verified_hire  BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(worker_profile_id, author_id)
);

CREATE INDEX idx_reviews_worker ON reviews(worker_profile_id);
CREATE INDEX idx_reviews_author ON reviews(author_id);

CREATE TABLE saved_workers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_profile_id UUID NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, worker_profile_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can manage own saved workers" ON saved_workers
  FOR ALL USING (auth.uid() = user_id);
