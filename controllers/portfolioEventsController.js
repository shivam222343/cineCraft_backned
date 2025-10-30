import { PortfolioEvent, PortfolioCategory, PortfolioMedia } from '../models/portfolioEventsModel.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// =============================================
// PORTFOLIO EVENTS CONTROLLERS
// =============================================

export const getEvents = async (req, res, next) => {
  try {
    const { include_categories } = req.query;
    let events;
    
    if (include_categories === 'true') {
      events = await PortfolioEvent.findAllWithCategories();
    } else {
      events = await PortfolioEvent.findAll();
    }
    
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { include_categories } = req.query;
    let event;
    
    if (include_categories === 'true') {
      event = await PortfolioEvent.findWithCategories(id);
    } else {
      event = await PortfolioEvent.findById(id);
    }
    
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, event_date, cover_images, background_media, display_order } = req.body;
    
    // Validation
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    
    const eventData = {
      title,
      description: description || null,
      event_date: event_date || null,
      cover_images: Array.isArray(cover_images) ? cover_images : (cover_images ? [cover_images] : []),
      background_media: background_media || null,
      display_order: display_order || 0
    };
    
    const event = await PortfolioEvent.create(eventData);
    res.status(201).json({ success: true, data: event, message: 'Event created successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, description, event_date, cover_images, background_media, display_order, is_active } = req.body;
    
    // Check if event exists
    const existingEvent = await PortfolioEvent.findById(id);
    if (!existingEvent) return res.status(404).json({ success: false, message: 'Event not found' });
    
    const eventData = {
      title: title || existingEvent.title,
      description: description !== undefined ? description : existingEvent.description,
      event_date: event_date !== undefined ? event_date : existingEvent.event_date,
      cover_images: cover_images !== undefined ? 
        (Array.isArray(cover_images) ? cover_images : (cover_images ? [cover_images] : [])) : 
        existingEvent.cover_images,
      background_media: background_media !== undefined ? background_media : existingEvent.background_media,
      display_order: display_order !== undefined ? display_order : existingEvent.display_order,
      is_active: is_active !== undefined ? is_active : existingEvent.is_active
    };
    
    const event = await PortfolioEvent.update(id, eventData);
    res.json({ success: true, data: event, message: 'Event updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    // Get event to check if it has media to delete from Cloudinary
    const event = await PortfolioEvent.findById(id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    
    // Delete images from Cloudinary if they exist
    const allImages = [...(event.cover_images || [])];
    if (event.background_media) allImages.push(event.background_media);
    
    for (const imageUrl of allImages) {
      if (imageUrl && imageUrl.includes('cloudinary.com')) {
        try {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await deleteFromCloudinary(`cinecraft-media/${publicId}`);
        } catch (cloudinaryError) {
          console.error('Error deleting image from Cloudinary:', cloudinaryError);
        }
      }
    }
    
    const deleted = await PortfolioEvent.delete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateEventOrder = async (req, res, next) => {
  try {
    const { updates } = req.body;
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'Updates must be an array' });
    }
    
    await PortfolioEvent.updateOrder(updates);
    res.json({ success: true, message: 'Event order updated successfully' });
  } catch (err) {
    next(err);
  }
};

// =============================================
// PORTFOLIO CATEGORIES CONTROLLERS
// =============================================

export const getCategories = async (req, res, next) => {
  try {
    const { event_id } = req.query;
    let categories;
    
    if (event_id) {
      categories = await PortfolioCategory.findByEventId(event_id);
    } else {
      categories = await PortfolioCategory.findAll();
    }
    
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { include_media } = req.query;
    let category;
    
    if (include_media === 'true') {
      category = await PortfolioCategory.findWithMedia(id);
    } else {
      category = await PortfolioCategory.findById(id);
    }
    
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { event_id, name, description, display_order } = req.body;
    
    // Validation
    if (!event_id) return res.status(400).json({ success: false, message: 'Event ID is required' });
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });
    
    // Check if event exists
    const event = await PortfolioEvent.findById(event_id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    
    const categoryData = {
      event_id,
      name,
      description: description || null,
      display_order: display_order || 0
    };
    
    const category = await PortfolioCategory.create(categoryData);
    res.status(201).json({ success: true, data: category, message: 'Category created successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, description, display_order, is_active } = req.body;
    
    // Check if category exists
    const existingCategory = await PortfolioCategory.findById(id);
    if (!existingCategory) return res.status(404).json({ success: false, message: 'Category not found' });
    
    const categoryData = {
      name: name || existingCategory.name,
      description: description !== undefined ? description : existingCategory.description,
      display_order: display_order !== undefined ? display_order : existingCategory.display_order,
      is_active: is_active !== undefined ? is_active : existingCategory.is_active
    };
    
    const category = await PortfolioCategory.update(id, categoryData);
    res.json({ success: true, data: category, message: 'Category updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await PortfolioCategory.delete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// =============================================
// PORTFOLIO MEDIA CONTROLLERS
// =============================================

export const getMedia = async (req, res, next) => {
  try {
    const { category_id } = req.query;
    let media;
    
    if (category_id) {
      media = await PortfolioMedia.findByCategoryId(category_id);
    } else {
      media = await PortfolioMedia.findAll();
    }
    
    res.json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
};

export const getMediaById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const media = await PortfolioMedia.findById(id);
    if (!media) return res.status(404).json({ success: false, message: 'Media not found' });
    res.json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
};

export const createMedia = async (req, res, next) => {
  try {
    const { category_id, title, description, media_url, media_type, thumbnail_url, display_order } = req.body;
    
    // Validation
    if (!category_id) return res.status(400).json({ success: false, message: 'Category ID is required' });
    if (!media_url) return res.status(400).json({ success: false, message: 'Media URL is required' });
    if (!media_type) return res.status(400).json({ success: false, message: 'Media type is required' });
    
    // Validate media type
    if (!['image', 'video'].includes(media_type)) {
      return res.status(400).json({ success: false, message: 'Media type must be either "image" or "video"' });
    }
    
    // Check if category exists
    const category = await PortfolioCategory.findById(category_id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    
    const mediaData = {
      category_id,
      title: title || null,
      description: description || null,
      media_url,
      media_type,
      thumbnail_url: thumbnail_url || null,
      display_order: display_order || 0
    };
    
    const media = await PortfolioMedia.create(mediaData);
    res.status(201).json({ success: true, data: media, message: 'Media created successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateMedia = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, description, media_url, media_type, thumbnail_url, display_order, is_active } = req.body;
    
    // Check if media exists
    const existingMedia = await PortfolioMedia.findById(id);
    if (!existingMedia) return res.status(404).json({ success: false, message: 'Media not found' });
    
    // Validate media type if provided
    if (media_type && !['image', 'video'].includes(media_type)) {
      return res.status(400).json({ success: false, message: 'Media type must be either "image" or "video"' });
    }
    
    const mediaData = {
      title: title !== undefined ? title : existingMedia.title,
      description: description !== undefined ? description : existingMedia.description,
      media_url: media_url || existingMedia.media_url,
      media_type: media_type || existingMedia.media_type,
      thumbnail_url: thumbnail_url !== undefined ? thumbnail_url : existingMedia.thumbnail_url,
      display_order: display_order !== undefined ? display_order : existingMedia.display_order,
      is_active: is_active !== undefined ? is_active : existingMedia.is_active
    };
    
    const media = await PortfolioMedia.update(id, mediaData);
    res.json({ success: true, data: media, message: 'Media updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    // Get media to check if it has files to delete from Cloudinary
    const media = await PortfolioMedia.findById(id);
    if (!media) return res.status(404).json({ success: false, message: 'Media not found' });
    
    // Delete files from Cloudinary if they exist
    const filesToDelete = [media.media_url, media.thumbnail_url].filter(Boolean);
    
    for (const fileUrl of filesToDelete) {
      if (fileUrl && fileUrl.includes('cloudinary.com')) {
        try {
          const publicId = fileUrl.split('/').pop().split('.')[0];
          await deleteFromCloudinary(`cinecraft-media/${publicId}`);
        } catch (cloudinaryError) {
          console.error('Error deleting file from Cloudinary:', cloudinaryError);
        }
      }
    }
    
    const deleted = await PortfolioMedia.delete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Media not found' });
    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateMediaOrder = async (req, res, next) => {
  try {
    const { updates } = req.body;
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'Updates must be an array' });
    }
    
    await PortfolioMedia.updateOrder(updates);
    res.json({ success: true, message: 'Media order updated successfully' });
  } catch (err) {
    next(err);
  }
};
