import { query } from '../config/db.js';

// Get all sponsor settings
export const getSponsorSettings = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT setting_key, setting_value, description 
      FROM sponsor_settings 
      ORDER BY setting_key
    `);
    
    // Convert to object format for easier frontend use
    const settings = {};
    result.rows.forEach(row => {
      settings[row.setting_key] = {
        value: row.setting_value,
        description: row.description
      };
    });
    
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching sponsor settings:', error);
    next(error);
  }
};

// Update sponsor settings
export const updateSponsorSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ 
        success: false, 
        message: 'Settings object is required' 
      });
    }
    
    // Update each setting
    const updatePromises = Object.entries(settings).map(([key, value]) => {
      return query(`
        UPDATE sponsor_settings 
        SET setting_value = $1, updated_at = NOW() 
        WHERE setting_key = $2
      `, [value, key]);
    });
    
    await Promise.all(updatePromises);
    
    // Return updated settings
    const result = await query(`
      SELECT setting_key, setting_value, description 
      FROM sponsor_settings 
      ORDER BY setting_key
    `);
    
    const updatedSettings = {};
    result.rows.forEach(row => {
      updatedSettings[row.setting_key] = {
        value: row.setting_value,
        description: row.description
      };
    });
    
    res.json({ 
      success: true, 
      data: updatedSettings,
      message: 'Sponsor settings updated successfully' 
    });
  } catch (error) {
    console.error('Error updating sponsor settings:', error);
    next(error);
  }
};

// Get specific setting
export const getSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    
    const result = await query(`
      SELECT setting_key, setting_value, description 
      FROM sponsor_settings 
      WHERE setting_key = $1
    `, [key]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Setting not found' 
      });
    }
    
    const setting = result.rows[0];
    res.json({ 
      success: true, 
      data: {
        key: setting.setting_key,
        value: setting.setting_value,
        description: setting.description
      }
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    next(error);
  }
};
