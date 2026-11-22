CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'TODO',
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT tasks_title_not_empty CHECK (btrim(title) <> ''),
  CONSTRAINT tasks_status_valid CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE'))
);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON tasks (created_at DESC);
