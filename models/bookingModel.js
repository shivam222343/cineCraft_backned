import { query } from '../config/db.js';

export const Booking = {
  create: async ({ user_id, service_id, name, email, phone, date, time, message, image, type, status }) => {
    // Ensure service_id is properly parsed as integer or null
    let parsedServiceId = null;
    if (service_id !== null && service_id !== undefined) {
      if (typeof service_id === 'string') {
        // If it's a comma-separated string, take the first ID
        const firstId = service_id.split(',')[0].trim();
        parsedServiceId = firstId ? parseInt(firstId) : null;
      } else {
        parsedServiceId = parseInt(service_id);
      }
      // Validate that it's a valid integer
      if (isNaN(parsedServiceId)) {
        parsedServiceId = null;
      }
    }

    const text = `
      INSERT INTO bookings (user_id, service_id, name, email, phone, date, time, message, image, type, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING id, user_id, service_id, name, email, phone, date, time, message, image, type, status, created_at
    `;
    const values = [user_id || null, parsedServiceId, name, email, phone, date, time, message, image || null, type || 'booking', status || 'pending'];
    const result = await query(text, values);
    return result.rows[0];
  },
  findAll: async () => {
    const text = `
      SELECT b.id, b.user_id, b.service_id, b.name, b.email, b.phone, b.date, b.time, b.message, b.image, b.type, b.status, b.created_at,
             s.title AS service_title, s.price, s.duration, s.category
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      ORDER BY b.created_at DESC
    `;
    const result = await query(text);
    return result.rows;
  },
  updateStatus: async (id, status) => {
    const text = `
      UPDATE bookings SET status = $1 WHERE id = $2
      RETURNING id, user_id, service_id, name, email, phone, date, time, message, image, type, status, created_at
    `;
    const result = await query(text, [status, id]);
    return result.rows[0];
  },
  delete: async (id) => {
    const text = 'DELETE FROM bookings WHERE id = $1 RETURNING id';
    const result = await query(text, [id]);
    return result.rows[0];
  },

  findById: async (id) => {
    const text = `
      SELECT b.id, b.user_id, b.service_id, b.name, b.email, b.phone, b.date, b.time, b.message, b.image, b.status, b.created_at,
             s.title AS service_title, s.price, s.duration, s.category
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      WHERE b.id = $1
    `;
    const result = await query(text, [id]);
    return result.rows[0];
  },

  findByStatus: async (status) => {
    const text = `
      SELECT b.id, b.user_id, b.service_id, b.name, b.email, b.phone, b.date, b.time, b.message, b.image, b.status, b.created_at,
             s.title AS service_title, s.price, s.duration, s.category
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      WHERE b.status = $1
      ORDER BY b.created_at DESC
    `;
    const result = await query(text, [status]);
    return result.rows;
  },

  findByUserId: async (userId) => {
    const text = `
      SELECT b.id, b.user_id, b.service_id, b.name, b.email, b.phone, b.date, b.time, b.message, b.image, b.status, b.created_at,
             s.title AS service_title, s.price, s.duration, s.category
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `;
    const result = await query(text, [userId]);
    return result.rows;
  },

  getStats: async () => {
    const text = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
      FROM bookings
    `;
    const result = await query(text);
    return result.rows[0];
  }
};
