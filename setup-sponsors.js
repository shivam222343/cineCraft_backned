import pool from './config/database.js';

async function setupSponsorsTable() {
  const client = await pool.connect();
  
  try {
    console.log('🏗️ Setting up sponsors table...');
    console.log('📊 Connected to database successfully');
    
    // Create sponsors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sponsors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo_url VARCHAR(500) NOT NULL,
        website_url VARCHAR(500),
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Sponsors table created successfully');
    
    // Check if we have any sponsors
    const existingSponsors = await client.query('SELECT COUNT(*) FROM sponsors');
    const sponsorCount = parseInt(existingSponsors.rows[0].count);
    
    if (sponsorCount === 0) {
      console.log('📝 Adding sample sponsors...');
      
      // Add sample sponsors
      const sampleSponsors = [
        {
          name: 'TechCorp Solutions',
          description: 'Leading technology solutions provider specializing in digital transformation and innovation.',
          logo_url: 'https://via.placeholder.com/200x100/4F46E5/FFFFFF?text=TechCorp',
          website_url: 'https://techcorp.example.com',
          display_order: 1
        },
        {
          name: 'Creative Studios',
          description: 'Award-winning creative agency delivering exceptional visual experiences and brand storytelling.',
          logo_url: 'https://via.placeholder.com/200x100/7C3AED/FFFFFF?text=Creative',
          website_url: 'https://creativestudios.example.com',
          display_order: 2
        },
        {
          name: 'Digital Media Group',
          description: 'Premier digital media company providing cutting-edge content creation and distribution services.',
          logo_url: 'https://via.placeholder.com/200x100/059669/FFFFFF?text=Digital',
          website_url: 'https://digitalmedia.example.com',
          display_order: 3
        },
        {
          name: 'Innovation Labs',
          description: 'Research and development company focused on emerging technologies and future innovations.',
          logo_url: 'https://via.placeholder.com/200x100/DC2626/FFFFFF?text=Innovation',
          website_url: 'https://innovationlabs.example.com',
          display_order: 4
        },
        {
          name: 'Global Partners',
          description: 'International consulting firm helping businesses expand globally with strategic partnerships.',
          logo_url: 'https://via.placeholder.com/200x100/EA580C/FFFFFF?text=Global',
          website_url: 'https://globalpartners.example.com',
          display_order: 5
        },
        {
          name: 'Future Vision',
          description: 'Forward-thinking company specializing in AI, machine learning, and next-generation technologies.',
          logo_url: 'https://via.placeholder.com/200x100/0891B2/FFFFFF?text=Future',
          website_url: 'https://futurevision.example.com',
          display_order: 6
        }
      ];
      
      for (const sponsor of sampleSponsors) {
        await client.query(`
          INSERT INTO sponsors (name, description, logo_url, website_url, display_order, is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, TRUE, NOW(), NOW())
        `, [sponsor.name, sponsor.description, sponsor.logo_url, sponsor.website_url, sponsor.display_order]);
      }
      
      console.log(`✅ Added ${sampleSponsors.length} sample sponsors`);
    } else {
      console.log(`ℹ️ Found ${sponsorCount} existing sponsors`);
    }
    
    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sponsors_active_order 
      ON sponsors (is_active, display_order, created_at)
    `);
    
    console.log('✅ Sponsors database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up sponsors table:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSponsorsTable()
    .then(() => {
      console.log('🎉 Sponsors setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}

export { setupSponsorsTable };
