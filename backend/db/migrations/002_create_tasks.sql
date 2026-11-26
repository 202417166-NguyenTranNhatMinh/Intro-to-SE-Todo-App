
-- Create task status enum
CREATE TYPE task_status AS ENUM (
    'TODO',
    'IN_PROGRESS',
    'DONE'
);

-- 1. Priority tags
CREATE TABLE priority_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    owner_user_id UUID NOT NULL
        REFERENCES users(id),

    name TEXT NOT NULL
        CHECK (
            name = TRIM(name)
            AND LENGTH(name) > 0
        ),

    color_code VARCHAR(7) NOT NULL
        CHECK (color_code ~ '^#[0-9A-Fa-f]{6}$'),

    priority_weight SMALLINT NOT NULL
        CHECK (priority_weight BETWEEN 1 AND 5),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_priority_tags_owner_name
ON priority_tags(owner_user_id, LOWER(name));


-- 2. Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    owner_user_id UUID NOT NULL
        REFERENCES users(id),

    priority_tag_id UUID
        REFERENCES priority_tags(id),

    title TEXT NOT NULL
        CHECK (LENGTH(TRIM(title)) > 0),

    description TEXT,

    due_at TIMESTAMPTZ,

    status task_status NOT NULL DEFAULT 'TODO',

    llm_note TEXT,

    position DOUBLE PRECISION NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_owner_user_id
ON tasks(owner_user_id);


-- 3. Subtasks
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    task_id UUID NOT NULL
        REFERENCES tasks(id),

    title TEXT NOT NULL,

    is_completed BOOLEAN NOT NULL DEFAULT FALSE,

    position DOUBLE PRECISION NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subtasks_task_id
ON subtasks(task_id);
