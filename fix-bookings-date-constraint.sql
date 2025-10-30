-- Fix bookings table to allow NULL dates for enquiries
-- This removes the NOT NULL constraint from date and time fields

-- Remove NOT NULL constraint from date column
ALTER TABLE bookings ALTER COLUMN date DROP NOT NULL;

-- Remove NOT NULL constraint from time column (if it exists)
ALTER TABLE bookings ALTER COLUMN time DROP NOT NULL;

-- Display success message
SELECT 'Bookings table updated successfully! Date and time fields now allow NULL values for enquiries.' as status;
