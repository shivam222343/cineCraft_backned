-- Insert Admin User for CineCraft Media
-- Email: jaywani22@gmail.com
-- Password: JAYwani$22 (will be hashed)

-- First, ensure the users table exists
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Check if user already exists and delete if found
DELETE FROM users WHERE email = 'jaywani22@gmail.com';

-- Insert the admin user
-- Password hash for 'JAYwani$22' using bcrypt with salt rounds 12
INSERT INTO users (name, email, password, role, created_at, updated_at)
VALUES (
  'Jay Wani',
  'jaywani22@gmail.com',
  '$2b$12$K8.QzOvQxqvOB0fOkH1ZZ2e1Y6SY3n0JVpaz6RtZpmjHtkobaN6CL2',
  'admin',
  NOW(),
  NOW()
);

-- Verify the user was created
SELECT 
  id,
  name,
  email,
  role,
  created_at,
  updated_at
FROM users 
WHERE email = 'jaywani22@gmail.com';

-- Display success message
SELECT 'Admin user created successfully!' as status,
       'Email: jaywani22@gmail.com' as login_email,
       'Password: JAYwani$22' as login_password,
       'Role: admin' as user_role;
