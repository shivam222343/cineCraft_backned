-- Add image column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS image TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN bookings.image IS 'Cloudinary URL for booking-related image upload';

-- Update existing records to have NULL image (optional)
UPDATE bookings SET image = NULL WHERE image IS NULL;
