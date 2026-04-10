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

CREATE INDEX IF NOT EXISTS idx_course_instructors_user ON course_instructors(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_course_instructors_course ON course_instructors(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
