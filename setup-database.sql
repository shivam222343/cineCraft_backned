-- CineCraft Media PostgreSQL Database Setup
-- Run this file to create and populate your database

-- Connect to PostgreSQL and create database (run this first)
-- CREATE DATABASE cinecraft;
-- \c cinecraft;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS portfolio CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration VARCHAR(100),
  features TEXT[], -- Array of features
  category VARCHAR(50) DEFAULT 'photography',
  image TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio table
CREATE TABLE portfolio (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'wedding',
  client VARCHAR(150),
  date DATE,
  location VARCHAR(200),
  images TEXT[], -- Array of image URLs
  tags TEXT[], -- Array of tags
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(20) NOT NULL,
  message TEXT,
  image TEXT, -- Cloudinary URL for booking-related image upload
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
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

-- Insert seed data
-- Admin user (password: Admin@123)
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@cinecraft.com', '$2b$12$uGQOvrQxqvOB0fOkH1ZZ2e1Y6SY3n0JVpaz6RtZpmjHtkobaN6CL2', 'admin');

-- Services data
INSERT INTO services (title, description, price, duration, features, category, image) VALUES
  ('Wedding Photography', 'Capture your special day with professional wedding photography', 1200.00, '8-10 hours', ARRAY['Full day coverage', 'Edited photos', 'Online gallery', 'Print release'], 'photography', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92'),
  ('Portrait Session', 'Professional portrait photography for individuals and families', 300.00, '1-2 hours', ARRAY['Studio or outdoor', 'Wardrobe changes', 'Retouched images', 'Digital delivery'], 'photography', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04'),
  ('Corporate Event', 'Professional event coverage for corporate functions', 800.00, '4-6 hours', ARRAY['Event coverage', 'Candid shots', 'Group photos', 'Same day preview'], 'event', 'https://images.unsplash.com/photo-1511578314322-379afb476865'),
  ('Wedding Videography', 'Cinematic wedding films that tell your love story', 2500.00, '8-12 hours', ARRAY['Ceremony & reception', 'Highlight reel', 'Raw footage', 'Drone shots'], 'videography', 'https://images.unsplash.com/photo-1519741497674-611481863552'),
  ('Commercial Video', 'Professional video production for businesses', 1500.00, '2-4 days', ARRAY['Script development', 'Professional crew', 'Post-production', 'Multiple formats'], 'videography', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4'),
  ('Drone Services', 'Aerial photography and videography with professional drones', 600.00, '2-4 hours', ARRAY['4K video', 'High-res photos', 'Multiple angles', 'Weather backup'], 'drone', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f'),
  ('Photo Editing', 'Professional photo retouching and enhancement services', 50.00, 'Per image', ARRAY['Color correction', 'Skin retouching', 'Background removal', 'Creative effects'], 'editing', 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960'),
  ('Video Editing', 'Professional video editing and post-production', 200.00, 'Per hour', ARRAY['Color grading', 'Audio sync', 'Transitions', 'Motion graphics'], 'editing', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d');

-- Portfolio data
INSERT INTO portfolio (title, description, category, client, date, location, images, tags, featured, status) VALUES
  ('Sarah & Michael Wedding', 'A beautiful outdoor wedding ceremony and reception', 'wedding', 'Sarah & Michael Johnson', '2024-01-15', 'Riverside Gardens, California', ARRAY['https://images.unsplash.com/photo-1606216794074-735e91aa2c92', 'https://images.unsplash.com/photo-1519741497674-611481863552'], ARRAY['wedding', 'outdoor', 'romantic', 'garden'], TRUE, 'published'),
  ('TechCorp Annual Conference', 'Corporate event photography and videography', 'corporate', 'TechCorp Inc.', '2024-01-10', 'Convention Center, San Francisco', ARRAY['https://images.unsplash.com/photo-1511578314322-379afb476865', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4'], ARRAY['corporate', 'conference', 'professional', 'networking'], FALSE, 'published'),
  ('Fashion Portrait Series', 'High-end fashion photography session', 'portrait', 'Elite Models Agency', '2024-01-05', 'Downtown Studio, Los Angeles', ARRAY['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04', 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960'], ARRAY['fashion', 'portrait', 'studio', 'professional'], TRUE, 'published'),
  ('Luxury Real Estate', 'Aerial and interior photography for luxury property', 'real-estate', 'Premium Properties LLC', '2024-01-20', 'Malibu Hills, California', ARRAY['https://images.unsplash.com/photo-1473968512647-3e447244af8f', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d'], ARRAY['real-estate', 'luxury', 'aerial', 'interior'], FALSE, 'published'),
  ('Product Launch Campaign', 'Commercial video production for product launch', 'commercial', 'InnoTech Solutions', '2024-02-01', 'Production Studio, San Diego', ARRAY['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4'], ARRAY['commercial', 'product', 'video', 'marketing'], FALSE, 'published'),
  ('Engagement Session', 'Romantic engagement photography in natural setting', 'portrait', 'Emma & David', '2024-01-25', 'Golden Gate Park, San Francisco', ARRAY['https://images.unsplash.com/photo-1606216794074-735e91aa2c92'], ARRAY['engagement', 'romantic', 'outdoor', 'couple'], FALSE, 'published');

-- Sample bookings
INSERT INTO bookings (service_id, name, email, phone, date, time, message, status) VALUES
  (1, 'John Smith', 'john@example.com', '+1-555-0123', '2024-02-15', '10:00 AM', 'Need video production for corporate event', 'pending'),
  (2, 'Sarah Johnson', 'sarah@example.com', '+1-555-0456', '2024-02-20', '2:00 PM', 'Wedding photography service needed', 'confirmed'),
  (3, 'Mike Davis', 'mike@example.com', '+1-555-0789', '2024-02-25', '11:30 AM', 'Drone footage for real estate project', 'completed'),
  (4, 'Emily Wilson', 'emily@example.com', '+1-555-0321', '2024-03-01', '9:00 AM', 'Live streaming for product launch', 'pending'),
  (5, 'David Brown', 'david@example.com', '+1-555-0654', '2024-03-05', '3:30 PM', 'Post-production services needed', 'confirmed');

-- Sample feedback
INSERT INTO feedback (name, email, rating, message, service_category, status) VALUES
  ('Alice Cooper', 'alice@example.com', 5, 'Absolutely amazing wedding photography! The team was professional and captured every precious moment beautifully.', 'photography', 'approved'),
  ('Bob Wilson', 'bob@example.com', 4, 'Great videography service for our corporate event. High quality work and timely delivery.', 'videography', 'approved'),
  ('Carol Martinez', 'carol@example.com', 5, 'Outstanding drone footage for our real estate project. The aerial shots were breathtaking!', 'drone', 'approved'),
  ('Daniel Lee', 'daniel@example.com', 4, 'Professional portrait session with excellent results. Highly recommend their services.', 'photography', 'approved'),
  ('Eva Thompson', 'eva@example.com', 5, 'The commercial video production exceeded our expectations. Creative and engaging content!', 'videography', 'pending');

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Display success message
SELECT 'Database setup completed successfully!' as status;
