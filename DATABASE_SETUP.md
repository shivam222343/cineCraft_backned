# Database Setup Instructions

## Fix "Column Does Not Exist" Error

The error occurs because your database was created with an older schema. Follow these steps to fix it:

## Option 1: Run Migration Script (Recommended)

If you have an existing database with data you want to keep:

```bash
# Connect to your PostgreSQL database
psql -U your_username -d cinecraft

# Run the migration script
\i migrations/update-schema.sql
```

## Option 2: Fresh Database Setup

If you want to start fresh with the correct schema:

```bash
# Drop and recreate the database
dropdb cinecraft
createdb cinecraft

# Connect to the new database
psql -U your_username -d cinecraft

# Run the updated setup script
\i setup-database.sql
```

## Option 3: Manual PostgreSQL Commands

If you prefer to run commands manually:

```sql
-- Connect to your database first
\c cinecraft

-- Run the migration
\i migrations/update-schema.sql
```

## What This Fixes

The migration script will:

### Services Table:
- ✅ Remove old `price_range` column (VARCHAR)
- ✅ Add new `price` column (DECIMAL)
- ✅ Add `duration` column (VARCHAR)
- ✅ Add `features` column (TEXT[])
- ✅ Add `category` column (VARCHAR)
- ✅ Add `image` column (TEXT)
- ✅ Add `updated_at` column (TIMESTAMP)

### Portfolio Table:
- ✅ Remove old `tags` column (VARCHAR)
- ✅ Remove old `media_url` column (TEXT)
- ✅ Add new `category` column (VARCHAR)
- ✅ Add `client` column (VARCHAR)
- ✅ Add `date` column (DATE)
- ✅ Add `location` column (VARCHAR)
- ✅ Add `images` column (TEXT[])
- ✅ Add `tags` column (TEXT[])
- ✅ Add `featured` column (BOOLEAN)
- ✅ Add `status` column (VARCHAR)
- ✅ Add `updated_at` column (TIMESTAMP)

### Users Table:
- ✅ Add `updated_at` column (TIMESTAMP)

## Verify Setup

After running the migration, verify your tables have the correct structure:

```sql
-- Check services table structure
\d services

-- Check portfolio table structure  
\d portfolio

-- Check users table structure
\d users

-- Verify data exists
SELECT COUNT(*) FROM services;
SELECT COUNT(*) FROM portfolio;
```

## Expected Results

After successful migration:
- ✅ Services table will have 8 sample services with prices, durations, and features
- ✅ Portfolio table will have 6 sample portfolio items with proper categorization
- ✅ All CRUD operations in the admin dashboard will work without errors
- ✅ No more "column does not exist" errors

## Troubleshooting

If you still get errors:

1. **Check your database connection**: Ensure your `.env` file has correct database credentials
2. **Verify PostgreSQL version**: Ensure you're using PostgreSQL 12+ for array support
3. **Check permissions**: Ensure your database user has CREATE, ALTER, and INSERT permissions
4. **Clear browser cache**: After database changes, clear your browser cache and restart the server

## Environment Variables

Make sure your `.env` file has:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cinecraft
DB_USER=your_username
DB_PASSWORD=your_password
```

After completing these steps, your CineCraft Media application should work perfectly with all CRUD operations!
