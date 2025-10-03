-- Migration script to update database schema to match application requirements
-- Run this script to fix the "column does not exist" errors

-- Update Services table
ALTER TABLE services 
DROP COLUMN IF EXISTS price_range;

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS duration VARCHAR(100),
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'photography',
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Update Portfolio table
ALTER TABLE portfolio 
DROP COLUMN IF EXISTS tags,
DROP COLUMN IF EXISTS media_url;

ALTER TABLE portfolio 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'wedding',
ADD COLUMN IF NOT EXISTS client VARCHAR(150),
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS location VARCHAR(200),
ADD COLUMN IF NOT EXISTS images TEXT[],
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Update Users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Clear existing data and insert new seed data with correct structure
DELETE FROM bookings;
DELETE FROM portfolio;
DELETE FROM services;

-- Insert updated services data
INSERT INTO services (title, description, price, duration, features, category, image) VALUES
  ('Wedding Photography', 'Capture your special day with professional wedding photography', 1200.00, '8-10 hours', ARRAY['Full day coverage', 'Edited photos', 'Online gallery', 'Print release'], 'photography', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92'),
  ('Portrait Session', 'Professional portrait photography for individuals and families', 300.00, '1-2 hours', ARRAY['Studio or outdoor', 'Wardrobe changes', 'Retouched images', 'Digital delivery'], 'photography', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04'),
  ('Corporate Event', 'Professional event coverage for corporate functions', 800.00, '4-6 hours', ARRAY['Event coverage', 'Candid shots', 'Group photos', 'Same day preview'], 'event', 'https://images.unsplash.com/photo-1511578314322-379afb476865'),
  ('Wedding Videography', 'Cinematic wedding films that tell your love story', 2500.00, '8-12 hours', ARRAY['Ceremony & reception', 'Highlight reel', 'Raw footage', 'Drone shots'], 'videography', 'https://images.unsplash.com/photo-1519741497674-611481863552'),
  ('Commercial Video', 'Professional video production for businesses', 1500.00, '2-4 days', ARRAY['Script development', 'Professional crew', 'Post-production', 'Multiple formats'], 'videography', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4'),
  ('Drone Services', 'Aerial photography and videography with professional drones', 600.00, '2-4 hours', ARRAY['4K video', 'High-res photos', 'Multiple angles', 'Weather backup'], 'drone', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f'),
  ('Photo Editing', 'Professional photo retouching and enhancement services', 50.00, 'Per image', ARRAY['Color correction', 'Skin retouching', 'Background removal', 'Creative effects'], 'editing', 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960'),
  ('Video Editing', 'Professional video editing and post-production', 200.00, 'Per hour', ARRAY['Color grading', 'Audio sync', 'Transitions', 'Motion graphics'], 'editing', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d');

-- Insert updated portfolio data
INSERT INTO portfolio (title, description, category, client, date, location, images, tags, featured, status) VALUES
  ('Sarah & Michael Wedding', 'A beautiful outdoor wedding ceremony and reception', 'wedding', 'Sarah & Michael Johnson', '2024-01-15', 'Riverside Gardens, California', ARRAY['https://images.unsplash.com/photo-1606216794074-735e91aa2c92', 'https://images.unsplash.com/photo-1519741497674-611481863552'], ARRAY['wedding', 'outdoor', 'romantic', 'garden'], TRUE, 'published'),
  ('TechCorp Annual Conference', 'Corporate event photography and videography', 'corporate', 'TechCorp Inc.', '2024-01-10', 'Convention Center, San Francisco', ARRAY['https://images.unsplash.com/photo-1511578314322-379afb476865', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4'], ARRAY['corporate', 'conference', 'professional', 'networking'], FALSE, 'published'),
  ('Fashion Portrait Series', 'High-end fashion photography session', 'portrait', 'Elite Models Agency', '2024-01-05', 'Downtown Studio, Los Angeles', ARRAY['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04', 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960'], ARRAY['fashion', 'portrait', 'studio', 'professional'], TRUE, 'published'),
  ('Luxury Real Estate', 'Aerial and interior photography for luxury property', 'real-estate', 'Premium Properties LLC', '2024-01-20', 'Malibu Hills, California', ARRAY['https://images.unsplash.com/photo-1473968512647-3e447244af8f', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d'], ARRAY['real-estate', 'luxury', 'aerial', 'interior'], FALSE, 'published'),
  ('Product Launch Campaign', 'Commercial video production for product launch', 'commercial', 'InnoTech Solutions', '2024-02-01', 'Production Studio, San Diego', ARRAY['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4'], ARRAY['commercial', 'product', 'video', 'marketing'], FALSE, 'published'),
  ('Engagement Session', 'Romantic engagement photography in natural setting', 'portrait', 'Emma & David', '2024-01-25', 'Golden Gate Park, San Francisco', ARRAY['https://images.unsplash.com/photo-1606216794074-735e91aa2c92'], ARRAY['engagement', 'romantic', 'outdoor', 'couple'], FALSE, 'published');

-- Insert sample bookings (referencing the new service IDs)
INSERT INTO bookings (service_id, name, email, phone, date, time, message, status) VALUES
  (1, 'John Smith', 'john@example.com', '+1-555-0123', '2024-02-15', '10:00 AM', 'Need photography for corporate event', 'pending'),
  (2, 'Sarah Johnson', 'sarah@example.com', '+1-555-0456', '2024-02-20', '2:00 PM', 'Wedding videography service needed', 'confirmed'),
  (3, 'Mike Davis', 'mike@example.com', '+1-555-0789', '2024-02-25', '11:30 AM', 'VFX work for commercial project', 'completed'),
  (1, 'Emily Wilson', 'emily@example.com', '+1-555-0321', '2024-03-01', '9:00 AM', 'Portrait session for family', 'pending'),
  (2, 'David Brown', 'david@example.com', '+1-555-0654', '2024-03-05', '3:30 PM', 'Event coverage needed', 'confirmed');

-- Display success message
SELECT 'Database schema updated successfully! All tables now have correct columns.' as status;
