-- Instructor profile (optional, uses users table with role='instructor')
CREATE TABLE IF NOT EXISTS instructor_profiles (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  expertise TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many: course can have multiple instructors
CREATE TABLE IF NOT EXISTS course_instructors (
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (course_id, instructor_id)
);

-- Payments / Fees
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending','success','failed')),
  method VARCHAR(30) DEFAULT 'mock',
  transaction_ref VARCHAR(100),
  paid_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_instructors_course ON course_instructors(course_id);
