import { Portfolio } from '../models/portfolioModel.js';

export const getPortfolio = async (req, res, next) => {
  try {
    const { status, featured } = req.query;
    let items;
    
    if (featured === 'true') {
      items = await Portfolio.findFeatured();
    } else if (status === 'published') {
      items = await Portfolio.findPublished();
    } else {
      items = await Portfolio.findAll();
    }
    
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

export const getPortfolioById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await Portfolio.findById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const getPortfolioByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const items = await Portfolio.findByCategory(category);
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

export const createPortfolioItem = async (req, res, next) => {
  try {
    const { title, description, category, client, date, location, images, tags, featured, status, media_url } = req.body;
    
    // Validation
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    if (!description) return res.status(400).json({ success: false, message: 'Description is required' });
    
    // Validate category against domain categories
    const validCategories = ['photography', 'videography', 'cinematography', 'drone-services', 'vfx-post', 'commercial'];
    const portfolioCategory = validCategories.includes(category) ? category : 'photography';
    
    const portfolioData = {
      title,
      description,
      category: portfolioCategory,
      client: client || null,
      date: date || null,
      location: location || null,
      images: Array.isArray(images) ? images : (images ? [images] : []),
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      featured: featured || false,
      status: status || 'published',
      media_url: media_url || null
    };
    
    const item = await Portfolio.create(portfolioData);
    res.status(201).json({ success: true, data: item, message: 'Portfolio item created successfully' });
  } catch (err) {
    next(err);
  }
};

export const updatePortfolioItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, description, category, client, date, location, images, tags, featured, status, media_url } = req.body;
    
    // Check if portfolio item exists
    const existingItem = await Portfolio.findById(id);
    if (!existingItem) return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    
    // Validate category against domain categories
    const validCategories = ['photography', 'videography', 'cinematography', 'drone-services', 'vfx-post', 'commercial'];
    const portfolioCategory = category && validCategories.includes(category) ? category : existingItem.category;
    
    const portfolioData = {
      title: title || existingItem.title,
      description: description || existingItem.description,
      category: portfolioCategory,
      client: client !== undefined ? client : existingItem.client,
      date: date !== undefined ? date : existingItem.date,
      location: location !== undefined ? location : existingItem.location,
      images: images !== undefined ? (Array.isArray(images) ? images : (images ? [images] : [])) : existingItem.images,
      tags: tags !== undefined ? (Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [])) : existingItem.tags,
      featured: featured !== undefined ? featured : existingItem.featured,
      status: status || existingItem.status,
      media_url: media_url !== undefined ? media_url : existingItem.media_url
    };
    
    const item = await Portfolio.update(id, portfolioData);
    res.json({ success: true, data: item, message: 'Portfolio item updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deletePortfolioItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await Portfolio.delete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    res.json({ success: true, message: 'Portfolio item deleted successfully' });
  } catch (err) {
    next(err);
  }
};
