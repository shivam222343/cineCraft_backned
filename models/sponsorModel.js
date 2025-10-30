import pool from '../config/database.js';

export class Sponsor {
  static async findAll() {
    const query = `
      SELECT id, name, description, logo_url, website_url, display_order, is_active, created_at, updated_at 
      FROM sponsors 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC, created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, name, description, logo_url, website_url, display_order, is_active, created_at, updated_at 
      FROM sponsors 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(sponsorData) {
    const { name, description, logo_url, website_url, display_order = 0 } = sponsorData;
    const query = `
      INSERT INTO sponsors (name, description, logo_url, website_url, display_order, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, TRUE, NOW(), NOW())
      RETURNING id, name, description, logo_url, website_url, display_order, is_active, created_at, updated_at
    `;
    const result = await pool.query(query, [name, description, logo_url, website_url, display_order]);
    return result.rows[0];
  }

  static async update(id, sponsorData) {
    const { name, description, logo_url, website_url, display_order, is_active } = sponsorData;
    const query = `
      UPDATE sponsors 
      SET name = $2, description = $3, logo_url = $4, website_url = $5, 
          display_order = $6, is_active = $7, updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, description, logo_url, website_url, display_order, is_active, created_at, updated_at
    `;
    const result = await pool.query(query, [id, name, description, logo_url, website_url, display_order, is_active]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM sponsors WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateOrder(id, display_order) {
    const query = `
      UPDATE sponsors 
      SET display_order = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, display_order
    `;
    const result = await pool.query(query, [id, display_order]);
    return result.rows[0];
  }
}
