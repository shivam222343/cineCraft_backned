import { query } from '../config/db.js';

export const Portfolio = {
  findAll: async () => {
    const text = 'SELECT id, title, description, category, client, date, location, images, tags, featured, status, media_url, created_at, updated_at FROM portfolio ORDER BY created_at DESC';
    const result = await query(text);
    return result.rows;
  },
  
  findById: async (id) => {
    const text = 'SELECT id, title, description, category, client, date, location, images, tags, featured, status, media_url, created_at, updated_at FROM portfolio WHERE id = $1';
    const result = await query(text, [id]);
    return result.rows[0];
  },
  
  findByCategory: async (category) => {
    const text = 'SELECT id, title, description, category, client, date, location, images, tags, featured, status, media_url, created_at, updated_at FROM portfolio WHERE category = $1 ORDER BY created_at DESC';
    const result = await query(text, [category]);
    return result.rows;
  },
  
  findFeatured: async () => {
    const text = 'SELECT id, title, description, category, client, date, location, images, tags, featured, status, media_url, created_at, updated_at FROM portfolio WHERE featured = TRUE AND status = \'published\' ORDER BY created_at DESC';
    const result = await query(text);
    return result.rows;
  },
  
  findPublished: async () => {
    const text = 'SELECT id, title, description, category, client, date, location, images, tags, featured, status, media_url, created_at, updated_at FROM portfolio WHERE status = \'published\' ORDER BY created_at DESC';
    const result = await query(text);
    return result.rows;
  },
  
  create: async ({ title, description, category, client, date, location, images, tags, featured, status, media_url }) => {
    const text = `
      INSERT INTO portfolio (title, description, category, client, date, location, images, tags, featured, status, media_url, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING id, title, description, category, client, date, location, images, tags, featured, status, media_url, created_at, updated_at
    `;
    const values = [title, description, category, client, date, location, images, tags, featured, status, media_url];
    const result = await query(text, values);
    return result.rows[0];
  },
  
  update: async (id, { title, description, category, client, date, location, images, tags, featured, status, media_url }) => {
    const text = `
      UPDATE portfolio
      SET title = $1, description = $2, category = $3, client = $4, date = $5, location = $6, images = $7, tags = $8, featured = $9, status = $10, media_url = $11, updated_at = NOW()
      WHERE id = $12
      RETURNING id, title, description, category, client, date, location, images, tags, featured, status, media_url, created_at, updated_at
    `;
    const values = [title, description, category, client, date, location, images, tags, featured, status, media_url, id];
    const result = await query(text, values);
    return result.rows[0];
  },
  
  delete: async (id) => {
    const text = 'DELETE FROM portfolio WHERE id = $1 RETURNING id';
    const result = await query(text, [id]);
    return result.rows[0];
  }
};
