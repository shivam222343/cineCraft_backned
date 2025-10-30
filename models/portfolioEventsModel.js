import { query } from '../config/db.js';

export const PortfolioEvent = {
  findAll: async () => {
    const text = `
      SELECT id, title, description, event_date, cover_images, background_media, 
             display_order, is_active, created_at, updated_at 
      FROM portfolio_events 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC, created_at DESC
    `;
    const result = await query(text);
    return result.rows;
  },
  
  findById: async (id) => {
    const text = `
      SELECT id, title, description, event_date, cover_images, background_media, 
             display_order, is_active, created_at, updated_at 
      FROM portfolio_events 
      WHERE id = $1
    `;
    const result = await query(text, [id]);
    return result.rows[0];
  },
  
  findWithCategories: async (id) => {
    const text = `
      SELECT 
        e.id, e.title, e.description, e.event_date, e.cover_images, e.background_media, 
        e.display_order, e.is_active, e.created_at, e.updated_at,
        json_agg(
          json_build_object(
            'id', c.id,
            'name', c.name,
            'description', c.description,
            'display_order', c.display_order,
            'is_active', c.is_active
          ) ORDER BY c.display_order ASC
        ) FILTER (WHERE c.id IS NOT NULL) as categories
      FROM portfolio_events e
      LEFT JOIN portfolio_categories c ON e.id = c.event_id AND c.is_active = TRUE
      WHERE e.id = $1 AND e.is_active = TRUE
      GROUP BY e.id
    `;
    const result = await query(text, [id]);
    return result.rows[0];
  },
  
  findAllWithCategories: async () => {
    const text = `
      SELECT 
        e.id, e.title, e.description, e.event_date, e.cover_images, e.background_media, 
        e.display_order, e.is_active, e.created_at, e.updated_at,
        json_agg(
          json_build_object(
            'id', c.id,
            'name', c.name,
            'description', c.description,
            'display_order', c.display_order,
            'is_active', c.is_active
          ) ORDER BY c.display_order ASC
        ) FILTER (WHERE c.id IS NOT NULL) as categories
      FROM portfolio_events e
      LEFT JOIN portfolio_categories c ON e.id = c.event_id AND c.is_active = TRUE
      WHERE e.is_active = TRUE
      GROUP BY e.id
      ORDER BY e.display_order ASC, e.created_at DESC
    `;
    const result = await query(text);
    return result.rows;
  },
  
  create: async ({ title, description, event_date, cover_images, background_media, display_order }) => {
    const text = `
      INSERT INTO portfolio_events (title, description, event_date, cover_images, background_media, display_order, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, title, description, event_date, cover_images, background_media, display_order, is_active, created_at, updated_at
    `;
    const values = [title, description, event_date, cover_images, background_media, display_order || 0];
    const result = await query(text, values);
    return result.rows[0];
  },
  
  update: async (id, { title, description, event_date, cover_images, background_media, display_order, is_active }) => {
    const text = `
      UPDATE portfolio_events
      SET title = $1, description = $2, event_date = $3, cover_images = $4, 
          background_media = $5, display_order = $6, is_active = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING id, title, description, event_date, cover_images, background_media, display_order, is_active, created_at, updated_at
    `;
    const values = [title, description, event_date, cover_images, background_media, display_order, is_active, id];
    const result = await query(text, values);
    return result.rows[0];
  },
  
  delete: async (id) => {
    const text = 'DELETE FROM portfolio_events WHERE id = $1 RETURNING id';
    const result = await query(text, [id]);
    return result.rows[0];
  },
  
  updateOrder: async (updates) => {
    const client = await query.getClient();
    try {
      await client.query('BEGIN');
      
      for (const update of updates) {
        await client.query(
          'UPDATE portfolio_events SET display_order = $1, updated_at = NOW() WHERE id = $2',
          [update.display_order, update.id]
        );
      }
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

export const PortfolioCategory = {
  findAll: async () => {
    const text = `
      SELECT id, event_id, name, description, display_order, is_active, created_at, updated_at 
      FROM portfolio_categories 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC, created_at DESC
    `;
    const result = await query(text);
    return result.rows;
  },
  
  findById: async (id) => {
    const text = `
      SELECT id, event_id, name, description, display_order, is_active, created_at, updated_at 
      FROM portfolio_categories 
      WHERE id = $1
    `;
    const result = await query(text, [id]);
    return result.rows[0];
  },
  
  findByEventId: async (eventId) => {
    const text = `
      SELECT id, event_id, name, description, display_order, is_active, created_at, updated_at 
      FROM portfolio_categories 
      WHERE event_id = $1 AND is_active = TRUE 
      ORDER BY display_order ASC, created_at DESC
    `;
    const result = await query(text, [eventId]);
    return result.rows;
  },
  
  findWithMedia: async (id) => {
    const text = `
      SELECT 
        c.id, c.event_id, c.name, c.description, c.display_order, c.is_active, c.created_at, c.updated_at,
        json_agg(
          json_build_object(
            'id', m.id,
            'title', m.title,
            'description', m.description,
            'media_url', m.media_url,
            'media_type', m.media_type,
            'thumbnail_url', m.thumbnail_url,
            'display_order', m.display_order,
            'is_active', m.is_active
          ) ORDER BY m.display_order ASC
        ) FILTER (WHERE m.id IS NOT NULL) as media
      FROM portfolio_categories c
      LEFT JOIN portfolio_media m ON c.id = m.category_id AND m.is_active = TRUE
      WHERE c.id = $1 AND c.is_active = TRUE
      GROUP BY c.id
    `;
    const result = await query(text, [id]);
    return result.rows[0];
  },
  
  create: async ({ event_id, name, description, display_order }) => {
    const text = `
      INSERT INTO portfolio_categories (event_id, name, description, display_order, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, event_id, name, description, display_order, is_active, created_at, updated_at
    `;
    const values = [event_id, name, description, display_order || 0];
    const result = await query(text, values);
    return result.rows[0];
  },
  
  update: async (id, { name, description, display_order, is_active }) => {
    const text = `
      UPDATE portfolio_categories
      SET name = $1, description = $2, display_order = $3, is_active = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING id, event_id, name, description, display_order, is_active, created_at, updated_at
    `;
    const values = [name, description, display_order, is_active, id];
    const result = await query(text, values);
    return result.rows[0];
  },
  
  delete: async (id) => {
    const text = 'DELETE FROM portfolio_categories WHERE id = $1 RETURNING id';
    const result = await query(text, [id]);
    return result.rows[0];
  }
};

export const PortfolioMedia = {
  findAll: async () => {
    const text = `
      SELECT id, category_id, title, description, media_url, media_type, thumbnail_url, 
             display_order, is_active, created_at, updated_at 
      FROM portfolio_media 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC, created_at DESC
    `;
    const result = await query(text);
    return result.rows;
  },
  
  findById: async (id) => {
    const text = `
      SELECT id, category_id, title, description, media_url, media_type, thumbnail_url, 
             display_order, is_active, created_at, updated_at 
      FROM portfolio_media 
      WHERE id = $1
    `;
    const result = await query(text, [id]);
    return result.rows[0];
  },
  
  findByCategoryId: async (categoryId) => {
    const text = `
      SELECT id, category_id, title, description, media_url, media_type, thumbnail_url, 
             display_order, is_active, created_at, updated_at 
      FROM portfolio_media 
      WHERE category_id = $1 AND is_active = TRUE 
      ORDER BY display_order ASC, created_at DESC
    `;
    const result = await query(text, [categoryId]);
    return result.rows;
  },
  
  create: async ({ category_id, title, description, media_url, media_type, thumbnail_url, display_order }) => {
    const text = `
      INSERT INTO portfolio_media (category_id, title, description, media_url, media_type, thumbnail_url, display_order, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, category_id, title, description, media_url, media_type, thumbnail_url, display_order, is_active, created_at, updated_at
    `;
    const values = [category_id, title, description, media_url, media_type, thumbnail_url, display_order || 0];
    const result = await query(text, values);
    return result.rows[0];
  },
  
  update: async (id, { title, description, media_url, media_type, thumbnail_url, display_order, is_active }) => {
    const text = `
      UPDATE portfolio_media
      SET title = $1, description = $2, media_url = $3, media_type = $4, 
          thumbnail_url = $5, display_order = $6, is_active = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING id, category_id, title, description, media_url, media_type, thumbnail_url, display_order, is_active, created_at, updated_at
    `;
    const values = [title, description, media_url, media_type, thumbnail_url, display_order, is_active, id];
    const result = await query(text, values);
    return result.rows[0];
  },
  
  delete: async (id) => {
    const text = 'DELETE FROM portfolio_media WHERE id = $1 RETURNING id';
    const result = await query(text, [id]);
    return result.rows[0];
  },
  
  updateOrder: async (updates) => {
    const client = await query.getClient();
    try {
      await client.query('BEGIN');
      
      for (const update of updates) {
        await client.query(
          'UPDATE portfolio_media SET display_order = $1, updated_at = NOW() WHERE id = $2',
          [update.display_order, update.id]
        );
      }
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};
