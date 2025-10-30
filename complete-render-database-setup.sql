-- CineCraft Media - Complete Database Setup for Render PostgreSQL
-- This script creates all tables required by the CineCraft Media application
-- Run this script to set up the complete database structure with sample data

-- =============================================
-- DROP EXISTING TABLES (in correct order to handle foreign keys)
-- =============================================
DROP TABLE IF EXISTS portfolio_media CASCADE;
DROP TABLE IF EXISTS portfolio_categories CASCADE;
DROP TABLE IF EXISTS portfolio_events CASCADE;
DROP TABLE IF EXISTS sponsors CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS portfolio CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS users CASCADE;

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
-- PORTFOLIO TABLE (Legacy - for backward compatibility)
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
-- SPONSORS TABLE
-- =============================================
CREATE TABLE sponsors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PORTFOLIO EVENTS SYSTEM (Hierarchical Portfolio)
-- =============================================

-- Portfolio Events Table
CREATE TABLE portfolio_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date DATE,
  cover_images TEXT[], -- Array of cover image URLs for slider
  background_media TEXT, -- Background video/image URL for hover effect
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio Categories Table
CREATE TABLE portfolio_categories (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES portfolio_events(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio Media Table
CREATE TABLE portfolio_media (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES portfolio_categories(id) ON DELETE CASCADE,
  title VARCHAR(200),
  description TEXT,
  media_url TEXT NOT NULL,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
  thumbnail_url TEXT, -- For videos
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
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
CREATE INDEX idx_sponsors_active ON sponsors(is_active);
CREATE INDEX idx_sponsors_order ON sponsors(display_order);
CREATE INDEX idx_portfolio_events_active ON portfolio_events(is_active);
CREATE INDEX idx_portfolio_events_order ON portfolio_events(display_order);
CREATE INDEX idx_portfolio_categories_event ON portfolio_categories(event_id);
CREATE INDEX idx_portfolio_categories_active ON portfolio_categories(is_active);
CREATE INDEX idx_portfolio_categories_order ON portfolio_categories(display_order);
CREATE INDEX idx_portfolio_media_category ON portfolio_media(category_id);
CREATE INDEX idx_portfolio_media_active ON portfolio_media(is_active);
CREATE INDEX idx_portfolio_media_order ON portfolio_media(display_order);
CREATE INDEX idx_portfolio_media_type ON portfolio_media(media_type);

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Admin users (password: JAYwani$22 and Admin@123)
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

-- Legacy Portfolio data
INSERT INTO portfolio (title, description, category, client, year, thumbnail, images, tags, services, duration, featured, status, created_at, updated_at) VALUES
('Corporate Brand Film', 'A compelling brand story for a leading tech company, showcasing their innovation and values through cinematic storytelling.', 'videography', 'TechCorp Inc.', '2024', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=1200&h=800&fit=crop'], ARRAY['Corporate', 'Branding', 'Commercial'], ARRAY['Cinematography', 'Post Production', 'Color Grading'], '3 weeks', TRUE, 'published', NOW(), NOW()),
('Aerial Real Estate Tour', 'Stunning aerial footage showcasing luxury properties with cinematic drone work and smooth camera movements.', 'drone', 'Luxury Estates', '2024', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop'], ARRAY['Real Estate', 'Aerial', 'Commercial'], ARRAY['Drone Photography', 'Video Editing', 'Motion Graphics'], '1 week', TRUE, 'published', NOW(), NOW()),
('Music Video Production', 'High-energy music video with creative lighting, dynamic camera movements, and innovative visual effects.', 'music', 'Independent Artist', '2023', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop'], ARRAY['Music Video', 'Creative', 'Performance'], ARRAY['Cinematography', 'VFX', 'Color Grading'], '4 weeks', FALSE, 'published', NOW(), NOW());

-- Sample bookings
INSERT INTO bookings (service_id, name, email, phone, service, date, time, message, status, estimated_price, attachments, created_at, updated_at) VALUES
(4, 'John Smith', 'john@example.com', '+1 (555) 123-4567', 'videography', '2024-02-15', '10:00', 'Need a corporate video for our product launch. Looking for professional quality with multiple camera angles and professional lighting setup.', 'pending', '$2,500 - $4,000', ARRAY[]::text[], '2024-01-10 09:30:00', NOW()),
(3, 'Sarah Johnson', 'sarah@company.com', '+1 (555) 987-6543', 'photography', '2024-02-20', '14:00', 'Product photography for our e-commerce website. Need clean, professional shots of about 50 products with white background.', 'confirmed', '$1,200 - $2,000', ARRAY['product-list.pdf'], '2024-01-08 14:15:00', NOW()),
(6, 'Mike Davis', 'mike@startup.com', '+1 (555) 456-7890', 'commercial-drone', '2024-02-25', '09:00', 'Aerial shots of our new facility for marketing materials and website. Need both photos and video footage.', 'completed', '$1,500 - $3,000', ARRAY['facility-map.jpg', 'shot-list.docx'], '2024-01-05 11:20:00', NOW());

-- Sample feedback
INSERT INTO feedback (name, email, rating, message, service_category, status, created_at, updated_at) VALUES
('Alice Cooper', 'alice@example.com', 5, 'Absolutely amazing wedding photography! The team was professional and captured every precious moment beautifully.', 'photography', 'approved', NOW(), NOW()),
('Bob Wilson', 'bob@example.com', 4, 'Great videography service for our corporate event. High quality work and timely delivery.', 'videography', 'approved', NOW(), NOW()),
('Carol Martinez', 'carol@example.com', 5, 'Outstanding drone footage for our real estate project. The aerial shots were breathtaking!', 'drone-services', 'approved', NOW(), NOW()),
('Frank Rodriguez', 'frank@example.com', 5, 'Incredible VFX work on our commercial. The visual effects were seamless and professional.', 'vfx-post', 'approved', NOW(), NOW());

-- Sample contact form submissions
INSERT INTO contacts (name, email, phone, subject, message, status, created_at, updated_at) VALUES
('Jennifer Adams', 'jennifer@startup.com', '+1 (555) 111-2222', 'Quote Request for Brand Video', 'Hi, I would like to get a quote for creating a brand video for our tech startup. We are looking for something modern and engaging.', 'new', NOW(), NOW()),
('Robert Chen', 'robert@restaurant.com', '+1 (555) 333-4444', 'Food Photography Services', 'We need professional food photography for our new restaurant menu. Can you provide details about your services and pricing?', 'read', NOW(), NOW());

-- Sample sponsors
INSERT INTO sponsors (name, description, logo_url, website_url, display_order, created_at, updated_at) VALUES
('TechCorp Solutions', 'Leading technology partner for innovative solutions', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop', 'https://techcorp.com', 1, NOW(), NOW()),
('Creative Studios', 'Professional media production partner', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=100&fit=crop', 'https://creativestudios.com', 2, NOW(), NOW());

-- Portfolio Events System Sample Data
INSERT INTO portfolio_events (title, description, event_date, cover_images, background_media, display_order, created_at, updated_at) VALUES
('Wedding Shoot - Sarah & John', 'A beautiful outdoor wedding ceremony captured with cinematic elegance and artistic flair.', '2024-01-15', 
 ARRAY['https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop'], 
 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 1, NOW(), NOW()),

('Music Video - Electric Dreams', 'High-energy music video production featuring dynamic lighting and creative cinematography.', '2024-02-20', 
 ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop'], 
 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 2, NOW(), NOW()),

('Corporate Brand Film - TechCorp', 'Professional corporate video showcasing company values and innovation through storytelling.', '2024-03-10', 
 ARRAY['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop'], 
 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 3, NOW(), NOW());

-- Sample Categories for Wedding Shoot
INSERT INTO portfolio_categories (event_id, name, description, display_order, created_at, updated_at) VALUES
(1, 'Photography', 'Beautiful wedding photography capturing precious moments', 1, NOW(), NOW()),
(1, 'Videography', 'Cinematic wedding videography and highlights', 2, NOW(), NOW()),
(1, 'Drone Footage', 'Aerial shots of the wedding venue and ceremony', 3, NOW(), NOW());

-- Sample Categories for Music Video
INSERT INTO portfolio_categories (event_id, name, description, display_order, created_at, updated_at) VALUES
(2, 'Performance Shots', 'Artist performance and band shots', 1, NOW(), NOW()),
(2, 'VFX Sequences', 'Visual effects and motion graphics', 2, NOW(), NOW()),
(2, 'Behind the Scenes', 'Production process and making-of content', 3, NOW(), NOW());

-- Sample Media for Wedding Photography
INSERT INTO portfolio_media (category_id, title, description, media_url, media_type, display_order, created_at, updated_at) VALUES
(1, 'Ceremony Moments', 'Key moments from the wedding ceremony', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop', 'image', 1, NOW(), NOW()),
(1, 'Couple Portraits', 'Beautiful couple portrait session', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop', 'image', 2, NOW(), NOW()),
(1, 'Reception Details', 'Wedding reception and decoration details', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop', 'image', 3, NOW(), NOW());

-- Sample Media for Wedding Videography
INSERT INTO portfolio_media (category_id, title, description, media_url, media_type, thumbnail_url, display_order, created_at, updated_at) VALUES
(2, 'Wedding Highlights', 'Complete wedding day highlights reel', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 'video', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop', 1, NOW(), NOW()),
(2, 'Ceremony Coverage', 'Full ceremony documentation', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 'video', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop', 2, NOW(), NOW());

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Display success message and table information
SELECT 'CineCraft Media Database setup completed successfully!' as status;

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
UNION ALL
SELECT 
  'sponsors' as table_name, COUNT(*) as record_count FROM sponsors
UNION ALL
SELECT 
  'portfolio_events' as table_name, COUNT(*) as record_count FROM portfolio_events
UNION ALL
SELECT 
  'portfolio_categories' as table_name, COUNT(*) as record_count FROM portfolio_categories
UNION ALL
SELECT 
  'portfolio_media' as table_name, COUNT(*) as record_count FROM portfolio_media
ORDER BY table_name;
