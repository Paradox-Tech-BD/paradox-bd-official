CREATE TABLE IF NOT EXISTS course_instructors (
  id SERIAL PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clerk_user_id, course_id)
);

CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_proof_url TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clerk_user_id, course_id)
);

CREATE TABLE IF NOT EXISTS course_sections (
  id SERIAL PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_lectures (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'video',
  r2_key TEXT,
  duration INTEGER,
  quiz_data JSONB,
  markdown_content TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_messages (
  id SERIAL PRIMARY KEY,
  course_id TEXT NOT NULL,
  sender_clerk_id TEXT NOT NULL,
  sender_role TEXT NOT NULL DEFAULT 'learner',
  message TEXT NOT NULL,
  parent_id INTEGER REFERENCES support_messages(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_instructors_user ON course_instructors(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_course_instructors_course ON course_instructors(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_course ON course_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lectures_section ON course_lectures(section_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_course ON support_messages(course_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_sender ON support_messages(sender_clerk_id);
