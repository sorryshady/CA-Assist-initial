const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'chat-backend-api.db');

// Open the SQLite database
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

// Create tables if they do not exist with the correct schema and constraints
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS "CA-helpers" (
        "TelegramID" TEXT NOT NULL,
        "FirstName" TEXT NOT NULL,
        "LastName" TEXT NOT NULL,
        "CAPANNumber" TEXT UNIQUE NOT NULL,
        "PrimaryLanguage" TEXT NOT NULL,
        "SecondaryLanguage" TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Error creating CA-helpers table', err.message);
        } else {
            console.log('CA-helpers table is ready.');
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS "Chat-matches" (
        "ChatID" TEXT NOT NULL,
        "ClientPAN" TEXT NOT NULL,
        "TelegramIDs" TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Error creating Chat-matches table', err.message);
        } else {
            console.log('Chat-matches table is ready.');
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS "Chat_sessions" (
        "ChatID" TEXT NOT NULL UNIQUE,
        "ClientPAN" TEXT NOT NULL,
        "MatchedCATelegramID" TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Error creating Chat_sessions table', err.message);
        } else {
            console.log('Chat_sessions table is ready.');
        }
    });
});

module.exports = db;