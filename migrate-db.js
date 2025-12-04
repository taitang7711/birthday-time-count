const Database = require('better-sqlite3');
const path = require('path');

// Connect to database
const dbPath = path.join(__dirname, 'daily.db');
const db = new Database(dbPath);

console.log('🔧 Starting database migration...');

try {
    // Check if note column exists
    const tableInfo = db.prepare("PRAGMA table_info(daily_moods)").all();
    const hasNoteColumn = tableInfo.some(col => col.name === 'note');
    
    if (!hasNoteColumn) {
        console.log('Adding note column to daily_moods table...');
        db.prepare('ALTER TABLE daily_moods ADD COLUMN note TEXT').run();
        console.log('✅ Note column added successfully!');
    } else {
        console.log('✅ Note column already exists.');
    }
    
    // Verify
    const updatedTableInfo = db.prepare("PRAGMA table_info(daily_moods)").all();
    console.log('\n📋 Current table structure:');
    updatedTableInfo.forEach(col => {
        console.log(`  - ${col.name}: ${col.type}`);
    });
    
    console.log('\n✅ Migration completed successfully!');
} catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
} finally {
    db.close();
}
