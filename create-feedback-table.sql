-- Create feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  service_category VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample feedback data
INSERT INTO feedback (name, email, rating, message, service_category, status) VALUES
  ('Alice Cooper', 'alice@example.com', 5, 'Absolutely amazing wedding photography! The team was professional and captured every precious moment beautifully.', 'photography', 'approved'),
  ('Bob Wilson', 'bob@example.com', 4, 'Great videography service for our corporate event. High quality work and timely delivery.', 'videography', 'approved'),
  ('Carol Martinez', 'carol@example.com', 5, 'Outstanding drone footage for our real estate project. The aerial shots were breathtaking!', 'drone', 'approved'),
  ('Daniel Lee', 'daniel@example.com', 4, 'Professional portrait session with excellent results. Highly recommend their services.', 'photography', 'approved'),
  ('Eva Thompson', 'eva@example.com', 5, 'The commercial video production exceeded our expectations. Creative and engaging content!', 'videography', 'pending')
ON CONFLICT DO NOTHING;

SELECT 'Feedback table created successfully!' as status;
