-- Migration: Add media_url column to portfolio table
-- This adds support for Cloudinary image URLs in portfolio items

-- Add media_url column to portfolio table
ALTER TABLE portfolio 
ADD COLUMN IF NOT EXISTS media_url TEXT;

-- Update existing portfolio items to use the first image from images array as media_url
UPDATE portfolio 
SET media_url = images[1] 
WHERE media_url IS NULL AND array_length(images, 1) > 0;

-- Add comment to the column
COMMENT ON COLUMN portfolio.media_url IS 'Primary media URL for portfolio item (Cloudinary URL)';

-- Display success message
SELECT 'Portfolio media_url column added successfully!' as status;
