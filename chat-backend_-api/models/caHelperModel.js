// Placeholder for CA helper model - As per initial setup, the model structure and functionality will be defined here.

// This is a placeholder and not the final implementation. The actual implementation will involve 
// interfacing with the SQLite database to manage CA helper records.

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the SQLite database file
const dbPath = path.resolve(__dirname, '../database/chat-backend-api.db');

// Open the SQLite database
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

class CAHelperModel {
    static createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS "CA-helpers" (
                "TelegramID" TEXT NOT NULL,
                "FirstName" TEXT NOT NULL,
                "LastName" TEXT NOT NULL,
                "CAPANNumber" TEXT UNIQUE NOT NULL,
                "PrimaryLanguage" TEXT NOT NULL,
                "SecondaryLanguage" TEXT NOT NULL
            )
        `;

        db.run(sql, (err) => {
            if (err) {
                console.error('Error creating CA-helpers table:', err.message);
                return;
            }
            console.log('CA-helpers table created or already exists.');
        });
    }

    static insert(caHelper) {
        return new Promise((resolve, reject) => {
            const { TelegramID, FirstName, LastName, CAPANNumber, PrimaryLanguage, SecondaryLanguage } = caHelper;
            const sql = `
                INSERT INTO "CA-helpers" (TelegramID, FirstName, LastName, CAPANNumber, PrimaryLanguage, SecondaryLanguage)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.run(sql, [TelegramID, FirstName, LastName, CAPANNumber, PrimaryLanguage, SecondaryLanguage], function(err) {
                if (err) {
                    console.error('Error inserting new CA helper:', err.message);
                    reject(err);
                    return;
                }
                console.log(`A new row has been inserted with rowid ${this.lastID}`);
                resolve(this.lastID);
            });
        });
    }

    static findByPAN(CAPANNumber) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM "CA-helpers" WHERE CAPANNumber = ?';

            db.get(sql, [CAPANNumber], (err, row) => {
                if (err) {
                    console.error('Error finding CA helper by PAN:', err.message);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }
}

module.exports = CAHelperModel;