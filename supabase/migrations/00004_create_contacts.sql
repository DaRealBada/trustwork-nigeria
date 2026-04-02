CREATE TABLE contact_hashes (
  id              SERIAL PRIMARY KEY,
  uploader_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  phone_hash      TEXT NOT NULL,
  uploaded_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(uploader_id, phone_hash)
);

CREATE INDEX idx_contact_hashes_phone_hash ON contact_hashes(phone_hash);
CREATE INDEX idx_contact_hashes_uploader ON contact_hashes(uploader_id);

CREATE TABLE contact_links (
  id              SERIAL PRIMARY KEY,
  owner_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_mutual       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(owner_id, contact_id)
);

CREATE INDEX idx_contact_links_owner ON contact_links(owner_id);
CREATE INDEX idx_contact_links_contact ON contact_links(contact_id);

ALTER TABLE contact_hashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own contact hashes" ON contact_hashes
  FOR ALL USING (auth.uid() = uploader_id);

CREATE POLICY "Users can see own contact links" ON contact_links
  FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = contact_id);
