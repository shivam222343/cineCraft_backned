-- CineCraft Media - Add Sample Data and Admin User
-- This script adds 2-3 sample entries to each table and creates an admin user

-- =============================================
-- ADD ADMIN USER WITH SPECIFIED EMAIL
-- =============================================
-- Password: Admin@123 (hashed with bcrypt)
INSERT INTO users (name, email, password, role, phone, avatar, is_active, created_at, updated_at) VALUES
('Shivam Dombe', 'shivamdombe1@gmail.com', '$2b$12$uGQOvrQxqvOB0fOkH1ZZ2e1Y6SY3n0JVpaz6RtZpmjHtkobaN6CL2', 'admin', '+91-9876543210', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', TRUE, NOW(), NOW()),
('John Manager', 'john.manager@cinecraft.com', '$2b$12$uGQOvrQxqvOB0fOkH1ZZ2e1Y6SY3n0JVpaz6RtZpmjHtkobaN6CL2', 'admin', '+1-555-0199', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', TRUE, NOW(), NOW()),
('Sarah Client', 'sarah.client@example.com', '$2b$12$uGQOvrQxqvOB0fOkH1ZZ2e1Y6SY3n0JVpaz6RtZpmjHtkobaN6CL2', 'user', '+1-555-0188', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', TRUE, NOW(), NOW());

-- =============================================
-- ADD ADDITIONAL SERVICES
-- =============================================
INSERT INTO services (title, description, price, min_price, max_price, duration, features, category, icon, image, deliverables, is_active, created_at, updated_at) VALUES
('Wedding Photography Premium', 'Luxury wedding photography package with multiple photographers and premium editing', 3500.00, 2500.00, 5000.00, '2 days', ARRAY['2 Lead Photographers', 'Engagement Session', 'Premium Album', 'Online Gallery', 'USB Drive', 'Print Release'], 'photography', '💍', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', ARRAY['500+ Edited Photos', 'Premium Wedding Album', 'Online Gallery Access', 'High-res Digital Files'], TRUE, NOW(), NOW()),

('Corporate Training Videos', 'Professional training video production for corporate learning and development', 2800.00, 1500.00, 4000.00, '3-4 weeks', ARRAY['Script Development', 'Professional Actors', 'Multi-Camera Setup', 'Interactive Elements', 'Subtitles'], 'videography', '🎓', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop', ARRAY['Final Training Videos', 'Interactive Modules', 'Subtitle Files', 'Source Materials'], TRUE, NOW(), NOW()),

('Real Estate Virtual Tours', 'Immersive 360-degree virtual tours for real estate properties with drone integration', 1800.00, 1200.00, 2500.00, '1-2 weeks', ARRAY['360° Photography', 'Drone Footage Integration', 'Interactive Hotspots', 'Virtual Staging', 'Mobile Optimization'], 'drone-services', '🏠', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop', ARRAY['Interactive Virtual Tour', 'Mobile App Version', 'Drone Footage', 'Marketing Materials'], TRUE, NOW(), NOW());

-- =============================================
-- ADD ADDITIONAL PORTFOLIO ITEMS
-- =============================================
INSERT INTO portfolio (title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status, created_at, updated_at) VALUES
('Tech Startup Launch Video', 'Dynamic launch video showcasing innovative AI technology with sleek animations and professional interviews', 'commercial', 'AI Innovations Ltd', '2024', '2024-01-20', 'Silicon Valley, CA', 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop', 
ARRAY['https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=800&fit=crop'], 
ARRAY['Technology', 'Startup', 'Commercial', 'AI'], ARRAY['Cinematography', 'Motion Graphics', 'Color Grading'], '5 weeks', TRUE, 'published', NOW(), NOW()),

('Fashion Brand Lookbook', 'High-end fashion photography for luxury brand seasonal collection with studio and outdoor locations', 'photography', 'Luxe Fashion House', '2024', '2024-02-10', 'New York, NY', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop',
ARRAY['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=800&fit=crop'],
ARRAY['Fashion', 'Luxury', 'Lookbook', 'Studio'], ARRAY['Fashion Photography', 'Retouching', 'Art Direction'], '3 weeks', FALSE, 'published', NOW(), NOW()),

('Documentary Film Project', 'Award-winning documentary about environmental conservation with cinematic storytelling and powerful interviews', 'documentary', 'Green Earth Foundation', '2023', '2023-11-15', 'Multiple Locations', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
ARRAY['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop'],
ARRAY['Documentary', 'Environmental', 'Award-winning', 'Social Impact'], ARRAY['Documentary Filmmaking', 'Interview Setup', 'Post Production'], '8 weeks', TRUE, 'published', NOW(), NOW());

-- =============================================
-- ADD ADDITIONAL BOOKINGS
-- =============================================
INSERT INTO bookings (user_id, service_id, name, email, phone, service, date, time, message, image, attachments, status, estimated_price, notes, created_at, updated_at) VALUES
(3, 1, 'Michael Rodriguez', 'michael@weddingplanning.com', '+1 (555) 789-0123', 'Wedding Photography Premium', '2024-04-15', '09:00', 'Planning a destination wedding in Tuscany. Need comprehensive photography coverage including pre-wedding events, ceremony, and reception. Looking for cinematic style with natural lighting.', 'https://res.cloudinary.com/demo/image/upload/sample.jpg', ARRAY['venue-photos.pdf', 'timeline.docx', 'inspiration-board.jpg'], 'confirmed', '$3,500 - $4,500', 'Client confirmed premium package with engagement session', '2024-01-18 14:30:00', NOW()),

(NULL, 2, 'Jennifer Park', 'jennifer@techcorp.com', '+1 (555) 456-7891', 'Corporate Training Videos', '2024-03-20', '10:00', 'Need to create a series of training videos for our new employee onboarding program. Content should be engaging and professional with interactive elements for better learning outcomes.', NULL, ARRAY['training-outline.pdf', 'brand-guidelines.pdf'], 'pending', '$2,800 - $3,500', 'Waiting for script approval from client', '2024-01-20 11:15:00', NOW()),

(NULL, 3, 'Robert Kim', 'robert@luxuryrealty.com', '+1 (555) 234-5678', 'Real Estate Virtual Tours', '2024-03-05', '13:00', 'High-end property in Beverly Hills needs virtual tour with drone footage. Property is 8,000 sq ft with pool, gardens, and city views. Need premium presentation for international buyers.', 'https://res.cloudinary.com/demo/image/upload/house.jpg', ARRAY['property-details.pdf', 'floor-plans.pdf'], 'in-progress', '$2,200 - $2,500', 'Drone permits obtained, shooting scheduled for next week', '2024-01-22 09:45:00', NOW());

-- =============================================
-- ADD ADDITIONAL FEEDBACK
-- =============================================
INSERT INTO feedback (name, email, rating, message, service_category, booking_id, status, admin_response, created_at, updated_at) VALUES
('Amanda Foster', 'amanda@startup.com', 5, 'Exceptional work on our product launch video! The team understood our vision perfectly and delivered beyond expectations. The final video has been instrumental in our successful launch campaign.', 'videography', NULL, 'approved', 'Thank you Amanda! We are thrilled that the video contributed to your successful launch. Wishing you continued success!', '2024-01-15 16:20:00', NOW()),

('Carlos Mendez', 'carlos@restaurant.com', 4, 'Great food photography session for our new menu. The styling and lighting were professional, and the photos really make our dishes look appetizing. Minor delay in delivery but overall satisfied.', 'photography', NULL, 'approved', 'Thanks for the feedback Carlos! We apologize for the slight delay and have improved our delivery timeline processes.', '2024-01-10 12:30:00', NOW()),

('Diana Chen', 'diana@events.org', 5, 'Outstanding drone coverage for our outdoor festival! The aerial shots captured the scale and energy of the event perfectly. Professional crew and seamless execution throughout the day.', 'drone-services', NULL, 'approved', 'Thank you Diana! Festival coverage is always exciting for our team. We are glad we could capture the energy and atmosphere of your event.', '2024-01-08 18:45:00', NOW());

-- =============================================
-- ADD ADDITIONAL CONTACTS
-- =============================================
INSERT INTO contacts (name, email, phone, subject, message, status, admin_notes, created_at, updated_at) VALUES
('Thomas Anderson', 'thomas@techstartup.com', '+1 (555) 987-6543', 'Explainer Video Production', 'We are a fintech startup looking to create an animated explainer video for our mobile app. Need something that explains complex financial concepts in simple, engaging way. What is your process and timeline?', 'new', NULL, '2024-01-25 10:15:00', NOW()),

('Maria Gonzalez', 'maria@nonprofit.org', '+1 (555) 654-3210', 'Documentary Collaboration', 'Our nonprofit is working on a documentary about community development. We have some footage but need professional editing and additional cinematography. Are you interested in collaborating on social impact projects?', 'read', 'Interesting project - schedule call to discuss partnership opportunities', '2024-01-23 14:20:00', NOW()),

('Kevin Liu', 'kevin@architecture.com', '+1 (555) 321-0987', 'Architectural Photography Services', 'We have several completed projects that need professional architectural photography for our portfolio and awards submissions. Looking for photographer experienced with interior and exterior architectural work.', 'replied', 'Sent portfolio examples and availability - follow up scheduled', '2024-01-21 09:30:00', NOW());

-- =============================================
-- ADD ADDITIONAL PORTFOLIO EVENTS
-- =============================================
INSERT INTO portfolio_events (title, description, event_date, cover_images, background_media, display_order, is_active, created_at, updated_at) VALUES
('Fashion Week Coverage', 'Comprehensive coverage of New York Fashion Week featuring runway shows, backstage moments, and designer interviews.', '2024-02-15', 
ARRAY['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop'], 
'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 5, TRUE, NOW(), NOW()),

('Tech Conference 2024', 'Multi-day technology conference with keynote speeches, panel discussions, and networking events documentation.', '2024-03-20', 
ARRAY['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop'], 
'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 6, TRUE, NOW(), NOW());

-- =============================================
-- ADD ADDITIONAL PORTFOLIO CATEGORIES
-- =============================================
INSERT INTO portfolio_categories (event_id, name, description, display_order, is_active, created_at, updated_at) VALUES
-- Fashion Week Categories
(5, 'Runway Photography', 'High-fashion runway show photography with professional lighting', 1, TRUE, NOW(), NOW()),
(5, 'Backstage Coverage', 'Behind-the-scenes moments and preparation footage', 2, TRUE, NOW(), NOW()),
(5, 'Designer Interviews', 'Exclusive interviews with fashion designers and industry leaders', 3, TRUE, NOW(), NOW()),

-- Tech Conference Categories  
(6, 'Keynote Presentations', 'Main stage presentations and speaker coverage', 1, TRUE, NOW(), NOW()),
(6, 'Networking Events', 'Social events and networking session documentation', 2, TRUE, NOW(), NOW()),
(6, 'Exhibition Floor', 'Vendor booths and product demonstration coverage', 3, TRUE, NOW(), NOW());

-- =============================================
-- ADD ADDITIONAL PORTFOLIO MEDIA
-- =============================================
INSERT INTO portfolio_media (category_id, title, description, media_url, media_type, thumbnail_url, display_order, is_active, created_at, updated_at) VALUES
-- Fashion Week Media
(13, 'Runway Highlights', 'Best moments from the main runway shows', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop', 'image', NULL, 1, TRUE, NOW(), NOW()),
(13, 'Designer Showcase', 'Featured designer collection highlights', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop', 'image', NULL, 2, TRUE, NOW(), NOW()),
(14, 'Backstage Preparation', 'Models and stylists preparing for shows', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=800&fit=crop', 'image', NULL, 1, TRUE, NOW(), NOW()),
(15, 'Designer Interview Reel', 'Compilation of designer interviews', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 'video', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop', 1, TRUE, NOW(), NOW()),

-- Tech Conference Media
(16, 'Opening Keynote', 'CEO keynote presentation highlights', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop', 'image', NULL, 1, TRUE, NOW(), NOW()),
(16, 'Panel Discussion', 'Industry expert panel on AI trends', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 'video', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop', 2, TRUE, NOW(), NOW()),
(17, 'Networking Reception', 'Evening networking event coverage', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop', 'image', NULL, 1, TRUE, NOW(), NOW());

-- Display success message
SELECT 'Sample data added successfully!' as status;

-- Show updated table counts
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
  'portfolio_events' as table_name, COUNT(*) as record_count FROM portfolio_events
UNION ALL
SELECT 
  'portfolio_categories' as table_name, COUNT(*) as record_count FROM portfolio_categories
UNION ALL
SELECT 
  'portfolio_media' as table_name, COUNT(*) as record_count FROM portfolio_media
ORDER BY table_name;
