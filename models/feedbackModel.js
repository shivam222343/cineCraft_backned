import pool, { query } from '../config/db.js';

const feedbackModel = {
  // Create new feedback
  async create(feedbackData) {
    const { name, email, rating, message, service_category } = feedbackData;
    const sql = `
      INSERT INTO feedback (name, email, rating, message, service_category, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *
    `;
    const values = [name, email, rating, message, service_category];
    const result = await query(sql, values);
    return result.rows[0];
  },

  // Get all feedback with pagination
  async findAll(limit = 50, offset = 0, status = null) {
    let sql = `
      SELECT * FROM feedback
    `;
    const values = [];
    
    if (status) {
      sql += ` WHERE status = $1`;
      values.push(status);
      sql += ` ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
      values.push(limit, offset);
    } else {
      sql += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
      values.push(limit, offset);
    }
    
    const result = await query(sql, values);
    return result.rows;
  },

  // Get approved feedback for public display
  async findApproved(limit = 10) {
    const sql = `
      SELECT * FROM feedback 
      WHERE status = 'approved' 
      ORDER BY created_at DESC 
      LIMIT $1
    `;
    const result = await query(sql, [limit]);
    return result.rows;
  },

  // Get feedback by ID
  async findById(id) {
    const sql = 'SELECT * FROM feedback WHERE id = $1';
    const result = await query(sql, [id]);
    return result.rows[0];
  },

  // Update feedback status (approve/reject)
  async updateStatus(id, status) {
    const sql = `
      UPDATE feedback 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await query(sql, [status, id]);
    return result.rows[0];
  },

  // Delete feedback
  async delete(id) {
    const sql = 'DELETE FROM feedback WHERE id = $1 RETURNING *';
    const result = await query(sql, [id]);
    return result.rows[0];
  },

  // Get feedback statistics
  async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_feedback,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
        ROUND(AVG(CASE WHEN status = 'approved' THEN rating END), 1) as average_rating,
        COUNT(CASE WHEN status = 'approved' AND rating = 5 THEN 1 END) as five_star_count,
        COUNT(CASE WHEN status = 'approved' AND rating = 4 THEN 1 END) as four_star_count,
        COUNT(CASE WHEN status = 'approved' AND rating = 3 THEN 1 END) as three_star_count,
        COUNT(CASE WHEN status = 'approved' AND rating = 2 THEN 1 END) as two_star_count,
        COUNT(CASE WHEN status = 'approved' AND rating = 1 THEN 1 END) as one_star_count
      FROM feedback
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  // Get feedback by service category
  async findByCategory(category, limit = 10) {
    const sql = `
      SELECT * FROM feedback 
      WHERE service_category = $1 AND status = 'approved'
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    const result = await query(sql, [category, limit]);
    return result.rows;
  },

  // Get average rating for a specific service category
  async getAverageRatingByCategory(category) {
    const sql = `
      SELECT 
        ROUND(AVG(rating), 1) as average_rating,
        COUNT(*) as total_reviews
      FROM feedback 
      WHERE service_category = $1 AND status = 'approved'
    `;
    const result = await query(sql, [category]);
    return result.rows[0];
  }
};

export default feedbackModel;
