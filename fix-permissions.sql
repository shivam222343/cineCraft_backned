-- Fix database permissions for CineCraft Media
-- Run this script to fix sequence permissions

-- Connect to your database first
\c cinecraft;

-- Grant all privileges on sequences to the current user
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- If you're using a different user, replace 'postgres' with your username
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_username;

-- Specifically grant permissions on the bookings sequence
GRANT ALL ON SEQUENCE bookings_id_seq TO postgres;
GRANT ALL ON SEQUENCE services_id_seq TO postgres;
GRANT ALL ON SEQUENCE portfolio_id_seq TO postgres;
GRANT ALL ON SEQUENCE users_id_seq TO postgres;

-- Grant table permissions as well
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;

-- Verify permissions
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasinserts,
    hasupdates,
    hasdeletes,
    hasselects
FROM pg_tables 
WHERE schemaname = 'public';

SELECT 'Permissions fixed successfully!' as status;
