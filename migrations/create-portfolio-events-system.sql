-- Portfolio Events System Migration
-- This creates the new hierarchical portfolio structure: Events -> Categories -> Media

-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS portfolio_media CASCADE;
DROP TABLE IF EXISTS portfolio_categories CASCADE;
DROP TABLE IF EXISTS portfolio_events CASCADE;

-- =============================================
-- PORTFOLIO EVENTS TABLE
-- =============================================
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

-- =============================================
-- PORTFOLIO CATEGORIES TABLE
-- =============================================
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

-- =============================================
-- PORTFOLIO MEDIA TABLE
-- =============================================
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

-- Sample Events
INSERT INTO portfolio_events (title, description, event_date, cover_images, background_media, display_order, created_at, updated_at) VALUES
('Wedding Shoot - Sarah & John', 'A beautiful outdoor wedding ceremony captured with cinematic elegance and artistic flair.', '2024-01-15', 
 ARRAY['https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop'], 
 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 1, NOW(), NOW()),

('Music Video - Electric Dreams', 'High-energy music video production featuring dynamic lighting and creative cinematography.', '2024-02-20', 
 ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop'], 
 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 2, NOW(), NOW()),

('Corporate Brand Film - TechCorp', 'Professional corporate video showcasing company values and innovation through storytelling.', '2024-03-10', 
 ARRAY['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop'], 
 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 3, NOW(), NOW()),

('Real Estate Showcase', 'Luxury property documentation with aerial drone footage and interior cinematography.', '2024-04-05', 
 ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'], 
 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 4, NOW(), NOW());

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

-- Sample Categories for Corporate Film
INSERT INTO portfolio_categories (event_id, name, description, display_order, created_at, updated_at) VALUES
(3, 'Interview Segments', 'Executive interviews and testimonials', 1, NOW(), NOW()),
(3, 'Product Showcase', 'Product demonstrations and features', 2, NOW(), NOW()),
(3, 'Office Culture', 'Workplace environment and team dynamics', 3, NOW(), NOW());

-- Sample Categories for Real Estate
INSERT INTO portfolio_categories (event_id, name, description, display_order, created_at, updated_at) VALUES
(4, 'Exterior Shots', 'Property exterior and landscape photography', 1, NOW(), NOW()),
(4, 'Interior Design', 'Room layouts and interior styling', 2, NOW(), NOW()),
(4, 'Aerial Views', 'Drone footage of property and surroundings', 3, NOW(), NOW());

-- Sample Media for Wedding Photography
INSERT INTO portfolio_media (category_id, title, description, media_url, media_type, display_order, created_at, updated_at) VALUES
(1, 'Ceremony Moments', 'Key moments from the wedding ceremony', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop', 'image', 1, NOW(), NOW()),
(1, 'Couple Portraits', 'Beautiful couple portrait session', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop', 'image', 2, NOW(), NOW()),
(1, 'Reception Details', 'Wedding reception and decoration details', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop', 'image', 3, NOW(), NOW());

-- Sample Media for Wedding Videography
INSERT INTO portfolio_media (category_id, title, description, media_url, media_type, thumbnail_url, display_order, created_at, updated_at) VALUES
(2, 'Wedding Highlights', 'Complete wedding day highlights reel', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 'video', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop', 1, NOW(), NOW()),
(2, 'Ceremony Coverage', 'Full ceremony documentation', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 'video', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop', 2, NOW(), NOW());

-- Sample Media for Music Video Performance
INSERT INTO portfolio_media (category_id, title, description, media_url, media_type, thumbnail_url, display_order, created_at, updated_at) VALUES
(4, 'Main Performance', 'Artist main performance sequence', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 'video', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', 1, NOW(), NOW()),
(4, 'Band Shots', 'Individual band member performances', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop', 'image', NULL, 2, NOW(), NOW());

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Display success message
SELECT 'Portfolio Events System created successfully!' as status;

-- Show table counts
SELECT 
  'portfolio_events' as table_name, COUNT(*) as record_count FROM portfolio_events
UNION ALL
SELECT 
  'portfolio_categories' as table_name, COUNT(*) as record_count FROM portfolio_categories
UNION ALL
SELECT 
  'portfolio_media' as table_name, COUNT(*) as record_count FROM portfolio_media
ORDER BY table_name;
