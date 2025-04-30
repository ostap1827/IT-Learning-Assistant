const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../db.sqlite'));

// Ініціалізація таблиць
db.serialize(() => {
    // Таблиця users (без змін)
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    userName TEXT,
    email TEXT UNIQUE,
    passwordHash TEXT,
    role TEXT
            )`);

    // Таблиця students
    db.run(`CREATE TABLE IF NOT EXISTS students (
    userId INTEGER PRIMARY KEY,
    currentProgress REAL,
    FOREIGN KEY (userId) REFERENCES users(id)
        )`);

    // Таблиця roadmaps з зовнішнім ключем на студента
    db.run(`CREATE TABLE IF NOT EXISTS roadmaps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    studentId INTEGER,
    FOREIGN KEY (studentId) REFERENCES students(userId)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS roadmapitem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    roadMapId INTEGER,
    FOREIGN KEY (roadMapId) REFERENCES roadmaps(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS resourcestypes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    typeTitle TEXT NOT NULL,
    roadMapItemId INTEGER,
    FOREIGN KEY (roadMapItemId) REFERENCES roadmapitem(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS learningresources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    resourcesTypeId INTEGER,
    FOREIGN KEY (resourcesTypeId) REFERENCES resourcestypes(id)
  )`);
});
module.exports = db;