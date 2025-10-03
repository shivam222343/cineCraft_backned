-- Migration: Create feedback table for user reviews and ratings
-- This adds support for user feedback with star ratings

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  service_category VARCHAR(50), -- Optional: which service they're reviewing
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_service_category ON feedback(service_category);

-- Add comment to the table
COMMENT ON TABLE feedback IS 'User feedback and ratings for CineCraft Media services';

-- Insert some sample feedback data
INSERT INTO feedback (name, email, rating, message, service_category, status) VALUES
  ('Sarah Johnson', 'sarah@example.com', 5, 'Absolutely amazing work! The team captured our wedding perfectly. Every moment was beautifully documented and the final photos exceeded our expectations.', 'photography', 'approved'),
  ('Michael Chen', 'michael@example.com', 5, 'Professional drone footage for our real estate project. The aerial shots were stunning and really showcased the property beautifully.', 'drone-services', 'approved'),
  ('Emily Rodriguez', 'emily@example.com', 4, 'Great video production for our corporate event. The team was professional and delivered high-quality content on time.', 'videography', 'approved'),
  ('David Thompson', 'david@example.com', 5, 'Outstanding cinematography work! The commercial we created together has been incredibly successful. Highly recommend!', 'cinematography', 'approved'),
  ('Lisa Wang', 'lisa@example.com', 5, 'The VFX and post-production work was incredible. They transformed our raw footage into something truly spectacular.', 'vfx-post', 'approved'),
  ('James Wilson', 'james@example.com', 4, 'Excellent commercial production services. Creative team with great attention to detail and professional execution.', 'commercial', 'approved');

-- Display success message
SELECT 'Feedback table created successfully!' as status;
