#!/usr/bin/env node

// This script extracts the file ids for all tab-session-data files from the backup's Manifest.db

const sqlite3 = require('sqlite3');
const path = require('path');
const { open } = require('sqlite');

// Path to the SQLite database file
const backupPath = '/backup';

(async () => {
  try {
    // Open the database
    const db = await open({
      filename: backupPath + '/Manifest.db',
      mode: sqlite3.OPEN_READONLY,
      driver: sqlite3.Database
    });

    // Perform a SELECT query
    const sql = 'SELECT fileID FROM Files WHERE domain = "AppDomainGroup-group.org.mozilla.ios.Firefox" AND relativePath LIKE "profile.profile/tab-session-data/%"';
    const rows = await db.all(sql);
    if (rows.length == 0) {
        console.error("Warning: No tab data files found. Either no tabs were open when the backup was made, or the tabs were saved in an unsupported format (this may be the case with older versions of Firefox, see README.md).");
    } else {
        console.log(rows.map((r) => r.fileID.slice(0,2) + "/" + r.fileID).join("\n"));
    }

    // Close the database connection
    await db.close();
  } catch (err) {
    console.error('Error reading Manifest.db:', err.message);
    process.exit(1);
  }
})();
