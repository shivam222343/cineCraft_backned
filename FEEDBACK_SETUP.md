# Feedback System Setup Guide

## Database Setup

### 1. Create Database
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE cinecraft;

-- Connect to the database
\c cinecraft;
```

### 2. Run Migrations
```sql
-- Create feedback table
\i migrations/create_feedback_table.sql

-- Add media_url to portfolio (if not already done)
\i migrations/add_media_url_to_portfolio.sql
```

### 3. Environment Configuration
Update your `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cinecraft
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret

# Cloudinary Configuration (optional for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## API Endpoints

### Public Endpoints (No Authentication Required)
- `POST /api/feedback` - Submit new feedback
- `GET /api/feedback/approved` - Get approved feedback for display
- `GET /api/feedback/stats` - Get feedback statistics
- `GET /api/feedback/category/:category` - Get feedback by service category

### Admin Endpoints (Authentication Required)
- `GET /api/feedback` - Get all feedback with filtering
- `GET /api/feedback/:id` - Get specific feedback
- `PATCH /api/feedback/:id/status` - Update feedback status (approve/reject)
- `DELETE /api/feedback/:id` - Delete feedback

## Frontend Features

### Components Created
- `StarRating.jsx` - Interactive star rating component
- `FeedbackModal.jsx` - User feedback submission modal
- `Testimonials.jsx` - Home page testimonials carousel
- `FeedbackPage.jsx` - Admin feedback management page

### Integration Points
- Home page testimonials section
- Floating feedback button in AnimatedSideButtons
- Admin panel navigation (/admin/feedback)
- Feedback modal accessible from multiple locations

## Usage

### For Users
1. Click the floating feedback button or "Share Your Experience" button
2. Fill out the feedback form with rating and message
3. Select service category (optional)
4. Submit feedback (goes to pending status)

### For Admins
1. Go to `/admin/feedback` in the admin panel
2. View all feedback with statistics dashboard
3. Filter by status (pending, approved, rejected)
4. Approve or reject pending feedback
5. View detailed feedback information
6. Delete inappropriate feedback

## Database Schema

```sql
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  service_category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Features

### Star Rating System
- Interactive 5-star rating with hover effects
- Average rating display with half-stars
- Multiple size variants (sm, md, lg, xl)
- Read-only mode for display purposes

### Testimonials Carousel
- Auto-playing with 5-second intervals
- Manual navigation with arrows and dots
- Responsive design for all screen sizes
- Shows only approved feedback

### Admin Management
- Statistics dashboard with key metrics
- Status management (approve/reject/unpublish)
- Filtering and search capabilities
- Detailed feedback view modal

### User Experience
- Floating feedback button always accessible
- Smooth animations throughout
- Mobile-responsive design
- Professional form validation

The feedback system is now fully integrated and ready for production use!
