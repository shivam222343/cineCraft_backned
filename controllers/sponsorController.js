import { Sponsor } from '../models/sponsorModel.js';

// Get all sponsors
export const getSponsors = async (req, res, next) => {
  try {
    const sponsors = await Sponsor.findAll();
    res.json({ success: true, data: sponsors });
  } catch (err) {
    next(err);
  }
};

// Get sponsor by ID
export const getSponsorById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const sponsor = await Sponsor.findById(id);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    res.json({ success: true, data: sponsor });
  } catch (err) {
    next(err);
  }
};

// Create new sponsor
export const createSponsor = async (req, res, next) => {
  try {
    const { name, description, logo_url, website_url, display_order } = req.body;
    
    // Validation
    if (!name) return res.status(400).json({ success: false, message: 'Sponsor name is required' });
    if (!logo_url) return res.status(400).json({ success: false, message: 'Logo URL is required' });
    
    const sponsorData = {
      name,
      description: description || null,
      logo_url,
      website_url: website_url || null,
      display_order: display_order || 0
    };
    
    const sponsor = await Sponsor.create(sponsorData);
    res.status(201).json({ success: true, data: sponsor, message: 'Sponsor created successfully' });
  } catch (err) {
    next(err);
  }
};

// Update sponsor
export const updateSponsor = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, description, logo_url, website_url, display_order, is_active } = req.body;
    
    // Check if sponsor exists
    const existingSponsor = await Sponsor.findById(id);
    if (!existingSponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    
    const sponsorData = {
      name: name || existingSponsor.name,
      description: description !== undefined ? description : existingSponsor.description,
      logo_url: logo_url || existingSponsor.logo_url,
      website_url: website_url !== undefined ? website_url : existingSponsor.website_url,
      display_order: display_order !== undefined ? display_order : existingSponsor.display_order,
      is_active: is_active !== undefined ? is_active : existingSponsor.is_active
    };
    
    const sponsor = await Sponsor.update(id, sponsorData);
    res.json({ success: true, data: sponsor, message: 'Sponsor updated successfully' });
  } catch (err) {
    next(err);
  }
};

// Delete sponsor
export const deleteSponsor = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    // Check if sponsor exists
    const existingSponsor = await Sponsor.findById(id);
    if (!existingSponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    
    await Sponsor.delete(id);
    res.json({ success: true, message: 'Sponsor deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Update sponsor display order
export const updateSponsorOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { display_order } = req.body;
    
    if (display_order === undefined) {
      return res.status(400).json({ success: false, message: 'Display order is required' });
    }
    
    const sponsor = await Sponsor.updateOrder(id, display_order);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    
    res.json({ success: true, data: sponsor, message: 'Sponsor order updated successfully' });
  } catch (err) {
    next(err);
  }
};
