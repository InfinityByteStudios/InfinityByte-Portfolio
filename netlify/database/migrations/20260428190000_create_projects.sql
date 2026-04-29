CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '#',
  image_url TEXT NOT NULL DEFAULT '',
  badge TEXT NOT NULL DEFAULT 'Project',
  cta_text TEXT NOT NULL DEFAULT 'Open',
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE INDEX projects_created_at_idx ON projects (created_at DESC);
