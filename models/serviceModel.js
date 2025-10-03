import { query } from '../config/db.js';

export const Service = {
  findAll: async () => {
    const text = 'SELECT id, title, description, price, duration, features, category, image, created_at, updated_at FROM services ORDER BY created_at DESC';
    const result = await query(text);
    return result.rows;
  },
  
  findById: async (id) => {
    const text = 'SELECT id, title, description, price, duration, features, category, image, created_at, updated_at FROM services WHERE id = $1';
    const result = await query(text, [id]);
    return result.rows[0];
  },
  
  create: async ({ title, description, price, duration, features, category, image }) => {
    const text = `
      INSERT INTO services (title, description, price, duration, features, category, image, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, title, description, price, duration, features, category, image, created_at, updated_at
    `;
    const values = [title, description, price, duration, features, category, image];
    const result = await query(text, values);
    return result.rows[0];
  },
  
  update: async (id, { title, description, price, duration, features, category, image }) => {
    const text = `
      UPDATE services
      SET title = $1, description = $2, price = $3, duration = $4, features = $5, category = $6, image = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING id, title, description, price, duration, features, category, image, created_at, updated_at
    `;
    const values = [title, description, price, duration, features, category, image, id];
    const result = await query(text, values);
    return result.rows[0];
  },
  
  delete: async (id) => {
    const text = 'DELETE FROM services WHERE id = $1 RETURNING id';
    const result = await query(text, [id]);
    return result.rows[0];
  },
  
  findByCategory: async (category) => {
    const text = 'SELECT id, title, description, price, duration, features, category, image, created_at, updated_at FROM services WHERE category = $1 ORDER BY created_at DESC';
    const result = await query(text, [category]);
    return result.rows;
  }
};
