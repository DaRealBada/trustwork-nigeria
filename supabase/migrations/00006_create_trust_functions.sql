-- Auto-update avg_rating and review_count on reviews change
CREATE OR REPLACE FUNCTION update_worker_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_worker_id UUID;
BEGIN
  target_worker_id := COALESCE(NEW.worker_profile_id, OLD.worker_profile_id);
  UPDATE worker_profiles
  SET
    avg_rating = COALESCE((
      SELECT AVG(rating)::NUMERIC(3,2) FROM reviews WHERE worker_profile_id = target_worker_id
    ), 0),
    review_count = (SELECT COUNT(*) FROM reviews WHERE worker_profile_id = target_worker_id),
    updated_at = NOW()
  WHERE id = target_worker_id;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_worker_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_worker_rating();

-- When a new user joins, link anyone who already had their number in contacts
CREATE OR REPLACE FUNCTION on_new_user_match_contacts(p_new_user_id UUID, p_phone_hash TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO contact_links (owner_id, contact_id)
  SELECT ch.uploader_id, p_new_user_id
  FROM contact_hashes ch
  WHERE ch.phone_hash = p_phone_hash
    AND ch.uploader_id != p_new_user_id
  ON CONFLICT (owner_id, contact_id) DO NOTHING;

  UPDATE contact_links SET is_mutual = TRUE
  WHERE owner_id = p_new_user_id
    AND contact_id IN (
      SELECT cl2.owner_id FROM contact_links cl2 WHERE cl2.contact_id = p_new_user_id
    );

  UPDATE contact_links SET is_mutual = TRUE
  WHERE contact_id = p_new_user_id
    AND owner_id IN (
      SELECT cl2.contact_id FROM contact_links cl2 WHERE cl2.owner_id = p_new_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Core trust-filtered search: returns workers ranked by trust level (1=contact, 2=FOAF, 3=public)
CREATE OR REPLACE FUNCTION search_workers_with_trust(
  p_user_id         UUID,
  p_skill_slug      TEXT DEFAULT NULL,
  p_city            TEXT DEFAULT NULL,
  p_area            TEXT DEFAULT NULL,
  p_min_rating      NUMERIC DEFAULT NULL,
  p_rate_max        INTEGER DEFAULT NULL,
  p_limit           INTEGER DEFAULT 20,
  p_offset          INTEGER DEFAULT 0
)
RETURNS TABLE(
  worker_profile_id UUID,
  user_id           UUID,
  full_name         TEXT,
  avatar_url        TEXT,
  headline          TEXT,
  city              TEXT,
  area              TEXT,
  avg_rating        NUMERIC,
  review_count      INTEGER,
  rate_min          INTEGER,
  rate_max          INTEGER,
  rate_type         TEXT,
  is_available      BOOLEAN,
  trust_level       INTEGER,
  trust_via_name    TEXT,
  trust_via_id      UUID,
  skill_names       TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  WITH first_degree AS (
    SELECT cl.contact_id FROM contact_links cl WHERE cl.owner_id = p_user_id
  ),
  second_degree AS (
    SELECT DISTINCT ON (cl2.contact_id)
      cl2.contact_id,
      cl1.contact_id AS via_id,
      p_bridge.full_name AS via_name
    FROM contact_links cl1
    JOIN contact_links cl2 ON cl2.owner_id = cl1.contact_id
    JOIN profiles p_bridge ON p_bridge.id = cl1.contact_id
    WHERE cl1.owner_id = p_user_id
      AND cl2.contact_id != p_user_id
      AND cl2.contact_id NOT IN (SELECT fd.contact_id FROM first_degree fd)
  )
  SELECT
    wp.id,
    wp.user_id,
    p.full_name,
    p.avatar_url,
    wp.headline,
    p.city,
    p.area,
    wp.avg_rating,
    wp.review_count,
    wp.rate_min,
    wp.rate_max,
    wp.rate_type,
    wp.is_available,
    CASE
      WHEN wp.user_id IN (SELECT fd.contact_id FROM first_degree fd) THEN 1
      WHEN wp.user_id IN (SELECT sd.contact_id FROM second_degree sd) THEN 2
      ELSE 3
    END AS trust_level,
    (SELECT sd.via_name FROM second_degree sd WHERE sd.contact_id = wp.user_id LIMIT 1),
    (SELECT sd.via_id FROM second_degree sd WHERE sd.contact_id = wp.user_id LIMIT 1),
    ARRAY(
      SELECT sc.name FROM worker_skills ws2
      JOIN skill_categories sc ON sc.id = ws2.skill_category_id
      WHERE ws2.worker_profile_id = wp.id
    )
  FROM worker_profiles wp
  JOIN profiles p ON p.id = wp.user_id
  LEFT JOIN worker_skills ws ON ws.worker_profile_id = wp.id
  LEFT JOIN skill_categories sc ON sc.id = ws.skill_category_id
  WHERE
    wp.is_available = TRUE
    AND (p_skill_slug IS NULL OR sc.slug = p_skill_slug)
    AND (p_city IS NULL OR p.city ILIKE p_city)
    AND (p_area IS NULL OR p.area ILIKE p_area)
    AND (p_min_rating IS NULL OR wp.avg_rating >= p_min_rating)
    AND (p_rate_max IS NULL OR wp.rate_min <= p_rate_max)
  GROUP BY wp.id, p.id
  ORDER BY
    CASE
      WHEN wp.user_id IN (SELECT fd.contact_id FROM first_degree fd) THEN 1
      WHEN wp.user_id IN (SELECT sd.contact_id FROM second_degree sd) THEN 2
      ELSE 3
    END,
    wp.avg_rating DESC,
    wp.review_count DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
