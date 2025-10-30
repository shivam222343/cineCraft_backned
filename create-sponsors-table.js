import pool from './config/database.js';

console.log('🏗️ Creating sponsors table...');

const client = await pool.connect();

try {
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
  
  // Insert sample sponsors
  const sampleSponsors = [
    {
      name: 'TechCorp Solutions',
      description: 'Leading technology solutions provider specializing in digital transformation and innovation.',
      logo_url: 'https://picsum.photos/200/100?random=1',
      website_url: 'https://techcorp.example.com',
      display_order: 1
    },
    {
      name: 'Creative Studios',
      description: 'Award-winning creative agency delivering exceptional visual experiences and brand storytelling.',
      logo_url: 'https://picsum.photos/200/100?random=2',
      website_url: 'https://creativestudios.example.com',
      display_order: 2
    },
    {
      name: 'Digital Media Group',
      description: 'Premier digital media company providing cutting-edge content creation and distribution services.',
      logo_url: 'https://picsum.photos/200/100?random=3',
      website_url: 'https://digitalmedia.example.com',
      display_order: 3
    },
    {
      name: 'Innovation Labs',
      description: 'Research and development company focused on emerging technologies and future innovations.',
      logo_url: 'https://picsum.photos/200/100?random=4',
      website_url: 'https://innovationlabs.example.com',
      display_order: 4
    },
    {
      name: 'Global Partners',
      description: 'International consulting firm helping businesses expand globally with strategic partnerships.',
      logo_url: 'https://picsum.photos/200/100?random=5',
      website_url: 'https://globalpartners.example.com',
      display_order: 5
    },
    {
      name: 'Future Vision',
      description: 'Forward-thinking company specializing in AI, machine learning, and next-generation technologies.',
      logo_url: 'https://picsum.photos/200/100?random=6',
      website_url: 'https://futurevision.example.com',
      display_order: 6
    }
  ];
  
  console.log('📝 Inserting sample sponsors...');
  
  for (const sponsor of sampleSponsors) {
    await client.query(`
      INSERT INTO sponsors (name, description, logo_url, website_url, display_order, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, TRUE, NOW(), NOW())
    `, [sponsor.name, sponsor.description, sponsor.logo_url, sponsor.website_url, sponsor.display_order]);
    
    console.log(`✅ Added: ${sponsor.name}`);
  }
  
  console.log('🎉 All sponsors added successfully!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  client.release();
  await pool.end();
}
