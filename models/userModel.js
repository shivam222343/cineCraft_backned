import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const User = {
  // Create a new user
  create: async (userData) => {
    const { name, email, password, role = 'user' } = userData;
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const text = `
      INSERT INTO users (name, email, password, role, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, name, email, role, created_at
    `;
    const values = [name, email, hashedPassword, role];
    
    const result = await query(text, values);
    return result.rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const text = 'SELECT * FROM users WHERE email = $1';
    const result = await query(text, [email]);
    return result.rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const text = 'SELECT id, name, email, role, created_at FROM users WHERE id = $1';
    const result = await query(text, [id]);
    return result.rows[0];
  },

  // Get all users (admin only)
  findAll: async () => {
    const text = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
    const result = await query(text);
    return result.rows;
  },

  // Update user
  update: async (id, userData) => {
    const { name, email, role } = userData;
    const text = `
      UPDATE users 
      SET name = $1, email = $2, role = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, name, email, role, created_at, updated_at
    `;
    const values = [name, email, role, id];
    
    const result = await query(text, values);
    return result.rows[0];
  },

  // Delete user
  delete: async (id) => {
    const text = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await query(text, [id]);
    return result.rows[0];
  },

  // Verify password
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};
