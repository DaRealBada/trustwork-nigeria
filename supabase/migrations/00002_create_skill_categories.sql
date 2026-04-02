CREATE TABLE skill_categories (
  id            SERIAL PRIMARY KEY,
  name          TEXT UNIQUE NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  icon          TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO skill_categories (name, slug, icon) VALUES
  ('Chef / Cook', 'chef', '🍳'),
  ('Driver', 'driver', '🚗'),
  ('Plumber', 'plumber', '🔧'),
  ('Electrician', 'electrician', '⚡'),
  ('Carpenter', 'carpenter', '🪚'),
  ('Cleaner', 'cleaner', '🧹'),
  ('Security Guard', 'security', '🛡️'),
  ('Nanny / Caregiver', 'nanny', '👶'),
  ('Tailor / Seamstress', 'tailor', '🧵'),
  ('Mechanic', 'mechanic', '🔩'),
  ('Gardener', 'gardener', '🌿'),
  ('Painter', 'painter', '🖌️'),
  ('AC Technician', 'ac-technician', '❄️'),
  ('Mason / Builder', 'mason', '🏗️'),
  ('Welder', 'welder', '🔥');
