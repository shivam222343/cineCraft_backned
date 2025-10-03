import feedbackModel from '../models/feedbackModel.js';

// Create new feedback (public access)
export const createFeedback = async (req, res) => {
  try {
    const { name, email, rating, message, service_category } = req.body;

    // Validation
    if (!name || !email || !rating || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, rating, and message are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const feedback = await feedbackModel.create({
      name,
      email,
      rating: parseInt(rating),
      message,
      service_category
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! It will be reviewed before being published.',
      data: feedback
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
};

// Get all feedback (admin only)
export const getAllFeedback = async (req, res) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;
    const feedback = await feedbackModel.findAll(
      parseInt(limit),
      parseInt(offset),
      status
    );

    res.json({
      success: true,
      data: feedback,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: feedback.length
      }
    });
  } catch (error) {
    console.error('Get all feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

// Get approved feedback for public display
export const getApprovedFeedback = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const feedback = await feedbackModel.findApproved(parseInt(limit));

    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Get approved feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

// Get feedback by ID (admin only)
export const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await feedbackModel.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Get feedback by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

// Update feedback status (admin only)
export const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved, rejected, or pending'
      });
    }

    const feedback = await feedbackModel.updateStatus(id, status);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      message: `Feedback ${status} successfully`,
      data: feedback
    });
  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback status',
      error: error.message
    });
  }
};

// Delete feedback (admin only)
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await feedbackModel.delete(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
};

// Get feedback statistics (public access)
export const getFeedbackStats = async (req, res) => {
  try {
    const stats = await feedbackModel.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback statistics',
      error: error.message
    });
  }
};

// Get feedback by category (public access)
export const getFeedbackByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;
    
    const feedback = await feedbackModel.findByCategory(category, parseInt(limit));
    const avgRating = await feedbackModel.getAverageRatingByCategory(category);

    res.json({
      success: true,
      data: {
        feedback,
        average_rating: avgRating.average_rating || 0,
        total_reviews: parseInt(avgRating.total_reviews) || 0
      }
    });
  } catch (error) {
    console.error('Get feedback by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category feedback',
      error: error.message
    });
  }
};
