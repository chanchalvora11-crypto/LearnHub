-- Categories
INSERT INTO categories (name, icon_url)
VALUES
('Web Development', ''),
('Data Structures', ''),
('DBMS', ''),
('Cybersecurity', '')
ON CONFLICT DO NOTHING;

-- Create an instructor user (password is irrelevant in seed; you can create via signup too)
-- If your users table has UNIQUE(email), use a new email.
INSERT INTO users (name, email, password, role)
VALUES ('Instructor One', 'instructor1@learnhub.com', '$2a$10$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'instructor')
ON CONFLICT DO NOTHING;

-- Courses (edit columns if your schema differs: title, description, instructor_id, category_id, banner_url, rating, price)
INSERT INTO courses (title, description, instructor_id, category_id, banner_url, rating, price)
SELECT
  'Full Stack Web Dev (MERN)',
  'React, Node, Express, PostgreSQL/MySQL, projects.',
  u.id,
  c.id,
  '',
  5,
  999
FROM users u, categories c
WHERE u.email='instructor1@learnhub.com' AND c.name='Web Development'
ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, instructor_id, category_id, banner_url, rating, price)
SELECT
  'DBMS Mastery',
  'ER model, normalization, SQL queries, transactions.',
  u.id,
  c.id,
  '',
  5,
  699
FROM users u, categories c
WHERE u.email='instructor1@learnhub.com' AND c.name='DBMS'
ON CONFLICT DO NOTHING;

-- Lessons (adjust columns if needed: course_id, title, video_url, "order", content)
INSERT INTO lessons (course_id, title, video_url, "order", content)
SELECT id, 'Intro', '', 1, 'Welcome to the course'
FROM courses WHERE title='DBMS Mastery'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, video_url, "order", content)
SELECT id, 'Normalization', '', 2, '1NF, 2NF, 3NF, BCNF'
FROM courses WHERE title='DBMS Mastery'
ON CONFLICT DO NOTHING;

-- course_instructors mapping (course can have multiple instructors)
INSERT INTO course_instructors (course_id, instructor_id)
SELECT co.id, u.id
FROM courses co, users u
WHERE co.title='DBMS Mastery' AND u.email='instructor1@learnhub.com'
ON CONFLICT DO NOTHING;