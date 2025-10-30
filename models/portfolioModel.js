import { query } from '../config/db.js';

export const Portfolio = {
  findAll: async () => {
    const text = 'SELECT id, title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status, created_at, updated_at FROM portfolio ORDER BY created_at DESC';
    const result = await query(text);
    return result.rows;
  },
  
  findById: async (id) => {
    const text = 'SELECT id, title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status, created_at, updated_at FROM portfolio WHERE id = $1';
    const result = await query(text, [id]);
    return result.rows[0];
  },
  
  findByCategory: async (category) => {
    const text = 'SELECT id, title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status, created_at, updated_at FROM portfolio WHERE category = $1 ORDER BY created_at DESC';
    const result = await query(text, [category]);
    return result.rows;
  },
  
  findFeatured: async () => {
    const text = 'SELECT id, title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status, created_at, updated_at FROM portfolio WHERE featured = TRUE AND status = \'published\' ORDER BY created_at DESC';
    const result = await query(text);
    return result.rows;
  },
  
  findPublished: async () => {
    const text = 'SELECT id, title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status, created_at, updated_at FROM portfolio WHERE status = \'published\' ORDER BY created_at DESC';
    const result = await query(text);
    return result.rows;
  },
  
  create: async ({ title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status }) => {
    const text = `
      INSERT INTO portfolio (title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
      RETURNING id, title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status, created_at, updated_at
    `;
    const values = [title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status];
    const result = await query(text, values);
    return result.rows[0];
  },
  
  update: async (id, { title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status }) => {
    const text = `
      UPDATE portfolio
      SET title = $1, description = $2, category = $3, client = $4, year = $5, date = $6, location = $7, thumbnail = $8, images = $9, tags = $10, services = $11, duration = $12, featured = $13, status = $14, updated_at = NOW()
      WHERE id = $15
      RETURNING id, title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status, created_at, updated_at
    `;
    const values = [title, description, category, client, year, date, location, thumbnail, images, tags, services, duration, featured, status, id];
    const result = await query(text, values);
    return result.rows[0];
  },
  
  delete: async (id) => {
    const text = 'DELETE FROM portfolio WHERE id = $1 RETURNING id';
    const result = await query(text, [id]);
    return result.rows[0];
  }
};
