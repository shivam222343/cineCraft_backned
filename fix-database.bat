@echo off
echo Fixing CineCraft Media Database Schema...
echo.
echo This will fix the "column price does not exist" error
echo.
pause

REM Replace these with your actual database credentials
set DB_USER=postgres
set DB_NAME=cinecraft
set DB_HOST=localhost
set DB_PORT=5432

echo Connecting to PostgreSQL database...
echo.

REM Run the SQL fix script
psql -U %DB_USER% -d %DB_NAME% -h %DB_HOST% -p %DB_PORT% -f fix-database.sql

echo.
echo Database fix completed!
echo.
echo You can now restart your backend server with: npm run dev
echo.
pause
