import { Service } from '../models/serviceModel.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

export const getServices = async (req, res, next) => {
  try {
    const services = await Service.findAll();
    res.json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

export const createService = async (req, res, next) => {
  try {
    const { title, description, price, duration, features, category, image } = req.body;
    
    // Validation
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    if (!description) return res.status(400).json({ success: false, message: 'Description is required' });
    if (!price) return res.status(400).json({ success: false, message: 'Price is required' });
    if (!duration) return res.status(400).json({ success: false, message: 'Duration is required' });
    
    const serviceData = {
      title,
      description,
      price: parseFloat(price),
      duration,
      features: features || [],
      category: category || 'photography',
      image: image || null
    };
    
    const service = await Service.create(serviceData);
    res.status(201).json({ success: true, data: service, message: 'Service created successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, description, price, duration, features, category, image } = req.body;
    
    // Check if service exists
    const existingService = await Service.findById(id);
    if (!existingService) return res.status(404).json({ success: false, message: 'Service not found' });
    
    const serviceData = {
      title: title || existingService.title,
      description: description || existingService.description,
      price: price ? parseFloat(price) : existingService.price,
      duration: duration || existingService.duration,
      features: features !== undefined ? features : existingService.features,
      category: category || existingService.category,
      image: image !== undefined ? image : existingService.image
    };
    
    const service = await Service.update(id, serviceData);
    res.json({ success: true, data: service, message: 'Service updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const getServicesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const services = await Service.findByCategory(category);
    res.json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    // Get service to check if it has an image to delete from Cloudinary
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    
    // Delete image from Cloudinary if it exists
    if (service.image && service.image.includes('cloudinary.com')) {
      try {
        const publicId = service.image.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`cinecraft-media/${publicId}`);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with service deletion even if image deletion fails
      }
    }
    
    const deleted = await Service.delete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Upload service image
export const uploadServiceImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }

    // Cloudinary automatically uploads the file and provides the URL
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    res.json({ 
      success: true, 
      data: {
        url: imageUrl,
        publicId: publicId
      },
      message: 'Image uploaded successfully' 
    });
  } catch (err) {
    console.error('Image upload error:', err);
    next(err);
  }
};
