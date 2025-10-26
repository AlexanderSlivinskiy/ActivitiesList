const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const db = new Database(path.join(__dirname, 'activities.db'));

// Initialize database schema
function initDatabase() {
  // Create activities table
  db.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idea TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create auth table for storing password hash
  db.exec(`
    CREATE TABLE IF NOT EXISTS auth (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      password_hash TEXT NOT NULL
    )
  `);

  // Set default password if not exists (default: "password")
  const authCheck = db.prepare('SELECT * FROM auth WHERE id = 1').get();
  if (!authCheck) {
    const defaultPassword = 'password';
    const hash = bcrypt.hashSync(defaultPassword, 10);
    db.prepare('INSERT INTO auth (id, password_hash) VALUES (1, ?)').run(hash);
    console.log('Default password set to: "password" - Please change this!');
  }
}

// Initialize database first
initDatabase();

// Activity operations (created after initialization)
const getActivities = db.prepare('SELECT * FROM activities ORDER BY created_at DESC');
const addActivity = db.prepare('INSERT INTO activities (idea) VALUES (?)');
const getRandomActivity = db.prepare('SELECT * FROM activities ORDER BY RANDOM() LIMIT 1');
const deleteActivity = db.prepare('DELETE FROM activities WHERE id = ?');

// Auth operations
const getPasswordHash = db.prepare('SELECT password_hash FROM auth WHERE id = 1');
const updatePassword = db.prepare('UPDATE auth SET password_hash = ? WHERE id = 1');

module.exports = {
  getActivities,
  addActivity,
  getRandomActivity,
  deleteActivity,
  getPasswordHash,
  updatePassword,
  db
};
