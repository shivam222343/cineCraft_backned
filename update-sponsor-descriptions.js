import pool from './config/database.js';

console.log('📝 Updating sponsor descriptions...');

const client = await pool.connect();

try {
  // Update existing sponsors with shorter, more appropriate descriptions
  const updates = [
    { 
      id: 1, 
      description: 'Leading technology solutions provider specializing in digital transformation and innovation.' 
    },
    { 
      id: 2, 
      description: 'Award-winning creative agency delivering exceptional visual experiences and brand storytelling.' 
    },
    { 
      id: 3, 
      description: 'Premier digital media company providing cutting-edge content creation and distribution services.' 
    },
    { 
      id: 4, 
      description: 'Research and development company focused on emerging technologies and future innovations.' 
    },
    { 
      id: 5, 
      description: 'International consulting firm helping businesses expand globally with strategic partnerships.' 
    },
    { 
      id: 6, 
      description: 'Forward-thinking company specializing in AI, machine learning, and next-generation technologies.' 
    }
  ];
  
  for (const update of updates) {
    // Truncate to 150 characters if needed
    const truncatedDescription = update.description.length > 150 
      ? update.description.substring(0, 147) + '...'
      : update.description;
      
    await client.query(
      'UPDATE sponsors SET description = $1, updated_at = NOW() WHERE id = $2',
      [truncatedDescription, update.id]
    );
    console.log(`✅ Updated sponsor ${update.id}: ${truncatedDescription.substring(0, 50)}...`);
  }
  
  console.log('🎉 All sponsor descriptions updated successfully!');
  
  // Show final results
  const result = await client.query('SELECT id, name, description FROM sponsors ORDER BY id');
  console.log('\n📋 Updated sponsors:');
  result.rows.forEach(sponsor => {
    console.log(`${sponsor.id}. ${sponsor.name}`);
    console.log(`   Description (${sponsor.description.length} chars): ${sponsor.description}`);
    console.log('');
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  client.release();
  await pool.end();
}
