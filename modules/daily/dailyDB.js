const Database = require('better-sqlite3');
const path = require('path');

// Khởi tạo database
const dbPath = path.join(__dirname, '..', '..', 'daily.db');
const db = new Database(dbPath);

// Tạo bảng nếu chưa tồn tại
db.exec(`
    CREATE TABLE IF NOT EXISTS daily_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS daily_moods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mood_date TEXT NOT NULL UNIQUE,
        mood_value INTEGER NOT NULL,
        mood_name TEXT,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// Lưu ngày bắt đầu
function saveStartDate(startDate) {
    try {
        const stmt = db.prepare(`
            INSERT INTO daily_records (start_date, updated_at) 
            VALUES (?, CURRENT_TIMESTAMP)
        `);
        const result = stmt.run(startDate);
        return { success: true, id: result.lastInsertRowid };
    } catch (error) {
        console.error('Error saving start date:', error);
        return { success: false, error: error.message };
    }
}

// Lấy ngày bắt đầu mới nhất
function getLatestStartDate() {
    try {
        const stmt = db.prepare(`
            SELECT start_date, created_at, updated_at 
            FROM daily_records 
            ORDER BY id DESC 
            LIMIT 1
        `);
        const result = stmt.get();
        return { success: true, data: result };
    } catch (error) {
        console.error('Error getting start date:', error);
        return { success: false, error: error.message };
    }
}

// Lưu mood của ngày
function saveMood(moodDate, moodValue, moodName, note = '') {
    try {
        const stmt = db.prepare(`
            INSERT INTO daily_moods (mood_date, mood_value, mood_name, note) 
            VALUES (?, ?, ?, ?)
            ON CONFLICT(mood_date) 
            DO UPDATE SET mood_value = ?, mood_name = ?, note = ?
        `);
        stmt.run(moodDate, moodValue, moodName, note, moodValue, moodName, note);
        return { success: true };
    } catch (error) {
        console.error('Error saving mood:', error);
        return { success: false, error: error.message };
    }
}

// Lấy mood của tháng
function getMoodsByMonth(year, month) {
    try {
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        const stmt = db.prepare(`
            SELECT mood_date, mood_value, mood_name, note, created_at 
            FROM daily_moods 
            WHERE mood_date LIKE ? 
            ORDER BY mood_date ASC
        `);
        const results = stmt.all(`${monthStr}%`);
        return { success: true, data: results };
    } catch (error) {
        console.error('Error getting moods:', error);
        return { success: false, error: error.message };
    }
}

// Lấy mood của một ngày cụ thể
function getMoodByDate(moodDate) {
    try {
        const stmt = db.prepare(`
            SELECT mood_date, mood_value, mood_name, note, created_at 
            FROM daily_moods 
            WHERE mood_date = ?
        `);
        const result = stmt.get(moodDate);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error getting mood by date:', error);
        return { success: false, error: error.message };
    }
}

// Xóa mood theo ngày
function deleteMood(moodDate) {
    try {
        const stmt = db.prepare(`
            DELETE FROM daily_moods 
            WHERE mood_date = ?
        `);
        const result = stmt.run(moodDate);
        return { success: true, changes: result.changes };
    } catch (error) {
        console.error('Error deleting mood:', error);
        return { success: false, error: error.message };
    }
}

// Lấy tất cả records để thống kê
function getAllDailyRecords() {
    try {
        const stmt = db.prepare(`
            SELECT * FROM daily_records 
            ORDER BY created_at DESC
        `);
        const results = stmt.all();
        return { success: true, data: results };
    } catch (error) {
        console.error('Error getting all records:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    saveStartDate,
    getLatestStartDate,
    saveMood,
    getMoodsByMonth,
    getMoodByDate,
    deleteMood,
    getAllDailyRecords
};
