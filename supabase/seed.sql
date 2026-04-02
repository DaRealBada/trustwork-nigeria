-- Demo seed data for local development
-- Run after migrations

INSERT INTO profiles (id, phone, phone_hash, full_name, role, city, area) VALUES
  ('00000000-0000-0000-0000-000000000001', '+2348012345678', 'demo-hash-1', 'Emeka Okonkwo', 'worker', 'Lagos', 'Lekki'),
  ('00000000-0000-0000-0000-000000000002', '+2348023456789', 'demo-hash-2', 'Bola Adeyemi', 'worker', 'Lagos', 'Victoria Island'),
  ('00000000-0000-0000-0000-000000000003', '+2348034567890', 'demo-hash-3', 'Funmi Adesanya', 'worker', 'Lagos', 'Ikeja'),
  ('00000000-0000-0000-0000-000000000004', '+2348098765432', 'demo-hash-4', 'Amaka Employer', 'employer', 'Lagos', 'Lekki')
ON CONFLICT DO NOTHING;

INSERT INTO worker_profiles (id, user_id, headline, bio, years_experience, rate_min, rate_max, rate_type, is_available, verified) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Professional Chef | 12 years | Lagos', 'Specialising in Nigerian and continental cuisines.', 12, 15000, 30000, 'daily', true, true),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Experienced Plumber | Lekki & VI', 'Certified plumber with 8 years experience.', 8, 10000, 25000, 'daily', true, false),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Personal Driver | Clean record', 'Professional driver, 6 years experience.', 6, 50000, 80000, 'monthly', true, false)
ON CONFLICT DO NOTHING;

INSERT INTO worker_skills (worker_profile_id, skill_category_id)
SELECT '10000000-0000-0000-0000-000000000001', id FROM skill_categories WHERE slug = 'chef'
ON CONFLICT DO NOTHING;

INSERT INTO worker_skills (worker_profile_id, skill_category_id)
SELECT '10000000-0000-0000-0000-000000000002', id FROM skill_categories WHERE slug = 'plumber'
ON CONFLICT DO NOTHING;

INSERT INTO worker_skills (worker_profile_id, skill_category_id)
SELECT '10000000-0000-0000-0000-000000000003', id FROM skill_categories WHERE slug = 'driver'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (worker_profile_id, author_id, rating, title, body, is_verified_hire) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 5, 'Exceptional cook, highly recommend', 'Emeka worked with our family for years. Honest, punctual and an incredible cook.', true),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 4, 'Fixed our pipes quickly', 'Very professional, came on time and fixed everything cleanly.', true)
ON CONFLICT DO NOTHING;
