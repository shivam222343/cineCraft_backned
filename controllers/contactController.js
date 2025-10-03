// Contact form submission controller
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message, serviceType } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send auto-reply to user
    
    // For now, we'll just log the submission and return success
    console.log('📧 Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      serviceType,
      timestamp: new Date().toISOString()
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.status(200).json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 2-4 hours.',
      data: {
        submittedAt: new Date().toISOString(),
        referenceId: `CM-${Date.now()}`
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again.',
      error: error.message
    });
  }
};

// Get contact information (for display purposes)
export const getContactInfo = async (req, res) => {
  try {
    const contactInfo = {
      studio: {
        name: "CineCraft Media Studio",
        address: "123 Creative Avenue, Los Angeles, CA 90210, United States",
        phone: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
        email: ["hello@cinecraftmedia.com", "bookings@cinecraftmedia.com"],
        hours: "Mon-Fri: 9AM-6PM PST"
      },
      social: {
        instagram: "@cinecraftmedia",
        facebook: "CineCraft Media Studio",
        linkedin: "linkedin.com/company/cinecraft"
      },
      responseTime: "2-4 hours during business hours"
    };

    res.json({
      success: true,
      data: contactInfo
    });
  } catch (error) {
    console.error('Get contact info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact information',
      error: error.message
    });
  }
};
