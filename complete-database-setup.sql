-- CineCraft Media - Complete Database Setup
-- This script creates all tables required by the frontend application
-- Run this script to set up the complete database structure with sample data

-- Connect to PostgreSQL and create database (run this first if database doesn't exist)
-- CREATE DATABASE cinecraft;
-- \c cinecraft;

-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS portfolio CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone VARCHAR(20),
  avatar TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- SERVICES TABLE
-- =============================================
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  duration VARCHAR(100),
  features TEXT[], -- Array of features
  category VARCHAR(50) DEFAULT 'photography',
  icon VARCHAR(10),
  image TEXT,
  deliverables TEXT[], -- Array of deliverables
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PORTFOLIO TABLE
-- =============================================
CREATE TABLE portfolio (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'videography',
  client VARCHAR(150),
  year VARCHAR(4),
  date DATE,
  location VARCHAR(200),
  thumbnail TEXT,
  images TEXT[], -- Array of image URLs
  tags TEXT[], -- Array of tags
  services TEXT[], -- Array of services used
  duration VARCHAR(50),
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- BOOKINGS TABLE
-- =============================================
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  service VARCHAR(100), -- Service name/type for reference
  date DATE NOT NULL,
  time VARCHAR(20) NOT NULL,
  message TEXT,
  image TEXT, -- Cloudinary URL for booking-related image upload
  attachments TEXT[], -- Array of attachment URLs
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')),
  estimated_price VARCHAR(50),
  notes TEXT, -- Admin notes
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- FEEDBACK TABLE
-- =============================================
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  service_category VARCHAR(50),
  booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_response TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- CONTACTS TABLE (for contact form submissions)
-- =============================================
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  admin_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_portfolio_category ON portfolio(category);
CREATE INDEX idx_portfolio_featured ON portfolio(featured);
CREATE INDEX idx_portfolio_status ON portfolio(status);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_rating ON feedback(rating);
CREATE INDEX idx_contacts_status ON contacts(status);

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Admin user (password: JAYwani$22)
INSERT INTO users (name, email, password, role, phone, created_at, updated_at) VALUES
('Jay Wani', 'jaywani22@gmail.com', '$2b$12$K8.QzOvQxqvOB0fOkH1ZZ2e1Y6SY3n0JVpaz6RtZpmjHtkobaN6CL2', 'admin', '+91-9876543210', NOW(), NOW()),
('Admin User', 'admin@cinecraft.com', '$2b$12$uGQOvrQxqvOB0fOkH1ZZ2e1Y6SY3n0JVpaz6RtZpmjHtkobaN6CL2', 'admin', '+1-555-0123', NOW(), NOW());

-- Services data based on frontend structure
INSERT INTO services (title, description, price, min_price, max_price, duration, features, category, icon, deliverables, created_at, updated_at) VALUES
('Graphic Design', 'Creative visual solutions for branding, marketing materials, and digital assets.', 1250.00, 500.00, 2000.00, '1-3 weeks', ARRAY['Logo Design', 'Brand Identity', 'Print Materials', 'Digital Graphics'], 'design', '🎨', ARRAY['Source Files', 'High-res Images', 'Brand Guidelines'], NOW(), NOW()),
('VFX & Visual Effects', 'Cutting-edge visual effects for films, commercials, and digital content.', 3250.00, 1500.00, 5000.00, '2-6 weeks', ARRAY['Motion Graphics', 'Compositing', '3D Effects', 'Color Grading'], 'vfx-post', '✨', ARRAY['Final Video', 'Project Files', 'Asset Library'], NOW(), NOW()),
('Photography Services', 'Professional photography services for events, products, and portraits.', 1900.00, 800.00, 3000.00, '1 day - 1 week', ARRAY['Event Photography', 'Product Shots', 'Portraits', 'Commercial'], 'photography', '📸', ARRAY['High-res Images', 'Edited Photos', 'Print-ready Files'], NOW(), NOW()),
('Videography Services', 'High-quality video production for various needs and platforms.', 2600.00, 1200.00, 4000.00, '1-4 weeks', ARRAY['Event Coverage', 'Promotional Videos', 'Documentaries', 'Social Media'], 'videography', '🎬', ARRAY['Final Video', 'Raw Footage', 'Multiple Formats'], NOW(), NOW()),
('Cinematography', 'Cinematic storytelling through professional film production.', 5000.00, 2000.00, 8000.00, '2-8 weeks', ARRAY['Film Production', 'Music Videos', 'Short Films', 'Commercials'], 'cinematography', '🎭', ARRAY['Master File', 'Color Graded Version', 'Behind-the-scenes'], NOW(), NOW()),
('Commercial Drone Services', 'Aerial photography and videography for commercial projects.', 2250.00, 1000.00, 3500.00, '1-2 weeks', ARRAY['Aerial Shots', 'Real Estate', 'Construction', 'Mapping'], 'drone-services', '🚁', ARRAY['4K Footage', 'Still Images', 'Flight Logs'], NOW(), NOW()),
('FPV Drone Services', 'Dynamic FPV drone footage for action sequences and unique perspectives.', 3000.00, 1500.00, 4500.00, '1-3 weeks', ARRAY['Action Sequences', 'Racing Coverage', 'Cinematic Flights', 'Live Streaming'], 'drone-services', '🏎️', ARRAY['Raw Footage', 'Edited Sequences', 'Slow Motion Clips'], NOW(), NOW()),
('Post Production', 'Complete post-production services from editing to final delivery.', 1900.00, 800.00, 3000.00, '1-4 weeks', ARRAY['Video Editing', 'Audio Mixing', 'Color Correction', 'Final Delivery'], 'vfx-post', '⚡', ARRAY['Final Cut', 'Project Files', 'Multiple Versions'], NOW(), NOW()),
('Broadcasting & Live Streaming', 'Live streaming and broadcasting solutions for events and content.', 4000.00, 2000.00, 6000.00, '1 day - 1 week', ARRAY['Live Streaming', 'Multi-Camera Setup', 'Event Broadcasting', 'Remote Production'], 'commercial', '📡', ARRAY['Live Stream', 'Recording', 'Technical Support'], NOW(), NOW());

-- Portfolio data based on frontend structure
INSERT INTO portfolio (title, description, category, client, year, thumbnail, images, tags, services, duration, featured, status, created_at, updated_at) VALUES
('Corporate Brand Film', 'A compelling brand story for a leading tech company, showcasing their innovation and values through cinematic storytelling.', 'videography', 'TechCorp Inc.', '2024', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=1200&h=800&fit=crop'], ARRAY['Corporate', 'Branding', 'Commercial'], ARRAY['Cinematography', 'Post Production', 'Color Grading'], '3 weeks', TRUE, 'published', NOW(), NOW()),
('Aerial Real Estate Tour', 'Stunning aerial footage showcasing luxury properties with cinematic drone work and smooth camera movements.', 'drone', 'Luxury Estates', '2024', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop'], ARRAY['Real Estate', 'Aerial', 'Commercial'], ARRAY['Drone Photography', 'Video Editing', 'Motion Graphics'], '1 week', TRUE, 'published', NOW(), NOW()),
('Music Video Production', 'High-energy music video with creative lighting, dynamic camera movements, and innovative visual effects.', 'music', 'Independent Artist', '2023', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop'], ARRAY['Music Video', 'Creative', 'Performance'], ARRAY['Cinematography', 'VFX', 'Color Grading'], '4 weeks', FALSE, 'published', NOW(), NOW()),
('Product Photography', 'Clean, professional product photography for e-commerce and marketing materials with perfect lighting and composition.', 'photography', 'Fashion Brand', '2024', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=800&fit=crop'], ARRAY['Product', 'Commercial', 'E-commerce'], ARRAY['Photography', 'Retouching', 'Styling'], '2 weeks', TRUE, 'published', NOW(), NOW()),
('Event Documentation', 'Comprehensive event coverage with multiple camera angles, live streaming, and professional documentation.', 'events', 'Corporate Events Co.', '2024', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop'], ARRAY['Events', 'Documentary', 'Live'], ARRAY['Multi-Camera', 'Live Streaming', 'Post Production'], '1 week', FALSE, 'published', NOW(), NOW()),
('Brand Identity Design', 'Complete brand identity package including logo design, color palette, typography, and comprehensive brand guidelines.', 'design', 'Startup Company', '2023', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1200&h=800&fit=crop'], ARRAY['Branding', 'Logo', 'Identity'], ARRAY['Logo Design', 'Brand Guidelines', 'Print Materials'], '3 weeks', TRUE, 'published', NOW(), NOW());

-- Sample bookings based on frontend data
INSERT INTO bookings (service_id, name, email, phone, service, date, time, message, status, estimated_price, attachments, created_at, updated_at) VALUES
(4, 'John Smith', 'john@example.com', '+1 (555) 123-4567', 'videography', '2024-02-15', '10:00', 'Need a corporate video for our product launch. Looking for professional quality with multiple camera angles and professional lighting setup.', 'pending', '$2,500 - $4,000', ARRAY[], '2024-01-10 09:30:00', NOW()),
(3, 'Sarah Johnson', 'sarah@company.com', '+1 (555) 987-6543', 'photography', '2024-02-20', '14:00', 'Product photography for our e-commerce website. Need clean, professional shots of about 50 products with white background.', 'confirmed', '$1,200 - $2,000', ARRAY['product-list.pdf'], '2024-01-08 14:15:00', NOW()),
(6, 'Mike Davis', 'mike@startup.com', '+1 (555) 456-7890', 'commercial-drone', '2024-02-25', '09:00', 'Aerial shots of our new facility for marketing materials and website. Need both photos and video footage.', 'completed', '$1,500 - $3,000', ARRAY['facility-map.jpg', 'shot-list.docx'], '2024-01-05 11:20:00', NOW()),
(9, 'Emily Chen', 'emily@events.com', '+1 (555) 321-9876', 'broadcasting', '2024-03-01', '16:00', 'Live streaming setup for corporate conference. Need multi-camera coverage and professional audio.', 'pending', '$3,000 - $5,000', ARRAY['event-schedule.pdf'], '2024-01-12 10:45:00', NOW()),
(5, 'David Wilson', 'david@musiclabel.com', '+1 (555) 654-3210', 'cinematography', '2024-03-10', '11:00', 'Music video production for upcoming single release. Looking for creative cinematography with multiple locations.', 'confirmed', '$4,000 - $7,000', ARRAY['storyboard.pdf', 'reference-video.mp4'], '2024-01-15 16:30:00', NOW());

-- Sample feedback
INSERT INTO feedback (name, email, rating, message, service_category, status, created_at, updated_at) VALUES
('Alice Cooper', 'alice@example.com', 5, 'Absolutely amazing wedding photography! The team was professional and captured every precious moment beautifully.', 'photography', 'approved', NOW(), NOW()),
('Bob Wilson', 'bob@example.com', 4, 'Great videography service for our corporate event. High quality work and timely delivery.', 'videography', 'approved', NOW(), NOW()),
('Carol Martinez', 'carol@example.com', 5, 'Outstanding drone footage for our real estate project. The aerial shots were breathtaking!', 'drone-services', 'approved', NOW(), NOW()),
('Daniel Lee', 'daniel@example.com', 4, 'Professional portrait session with excellent results. Highly recommend their services.', 'photography', 'approved', NOW(), NOW()),
('Eva Thompson', 'eva@example.com', 5, 'The commercial video production exceeded our expectations. Creative and engaging content!', 'videography', 'pending', NOW(), NOW()),
('Frank Rodriguez', 'frank@example.com', 5, 'Incredible VFX work on our commercial. The visual effects were seamless and professional.', 'vfx-post', 'approved', NOW(), NOW());

-- Sample contact form submissions
INSERT INTO contacts (name, email, phone, subject, message, status, created_at, updated_at) VALUES
('Jennifer Adams', 'jennifer@startup.com', '+1 (555) 111-2222', 'Quote Request for Brand Video', 'Hi, I would like to get a quote for creating a brand video for our tech startup. We are looking for something modern and engaging.', 'new', NOW(), NOW()),
('Robert Chen', 'robert@restaurant.com', '+1 (555) 333-4444', 'Food Photography Services', 'We need professional food photography for our new restaurant menu. Can you provide details about your services and pricing?', 'read', NOW(), NOW()),
('Lisa Park', 'lisa@events.org', '+1 (555) 555-6666', 'Event Coverage Inquiry', 'We have an upcoming charity gala and need both photography and videography coverage. Please let us know your availability for March 15th.', 'replied', NOW(), NOW());

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Display success message and table information
SELECT 'Database setup completed successfully!' as status;

-- Show table counts
SELECT 
  'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 
  'services' as table_name, COUNT(*) as record_count FROM services
UNION ALL
SELECT 
  'portfolio' as table_name, COUNT(*) as record_count FROM portfolio
UNION ALL
SELECT 
  'bookings' as table_name, COUNT(*) as record_count FROM bookings
UNION ALL
SELECT 
  'feedback' as table_name, COUNT(*) as record_count FROM feedback
UNION ALL
SELECT 
  'contacts' as table_name, COUNT(*) as record_count FROM contacts
ORDER BY table_name;
