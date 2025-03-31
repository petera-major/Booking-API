const sqlite3 = require('sqlite3').verbose();
const path = require('path'); 

const dbPath = path.join(__dirname, '../treaheart_booking.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(' Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database: treaheart_booking.db');
    }
});

module.exports = db;