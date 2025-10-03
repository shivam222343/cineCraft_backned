-- Create services table if it doesn't exist
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    duration VARCHAR(100),
    features TEXT[],
    category VARCHAR(100),
    image TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample services if table is empty
INSERT INTO services (title, description, price, duration, features, category, image)
SELECT 'Photography', 'Professional photography services', 500.00, '2-4 hours', ARRAY['High-resolution images', 'Professional editing', 'Digital gallery'], 'photography', null
WHERE NOT EXISTS (SELECT 1 FROM services WHERE title = 'Photography');

INSERT INTO services (title, description, price, duration, features, category, image)
SELECT 'Videography', 'Professional video production', 1000.00, '4-8 hours', ARRAY['4K recording', 'Professional editing', 'Color grading'], 'videography', null
WHERE NOT EXISTS (SELECT 1 FROM services WHERE title = 'Videography');

INSERT INTO services (title, description, price, duration, features, category, image)
SELECT 'VFX & Post Production', 'Visual effects and post-production', 1500.00, '1-2 weeks', ARRAY['Visual effects', 'Motion graphics', 'Sound design'], 'vfx', null
WHERE NOT EXISTS (SELECT 1 FROM services WHERE title = 'VFX & Post Production');
