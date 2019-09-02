const path = require('path');
const bettersqlite3 = require('better-sqlite3');
const config = require('../config');

const db = bettersqlite3(path.join(config.db.path, config.db.filename));

// Initial setup of the database
db.exec(`
	CREATE TABLE IF NOT EXISTS responses (
		reddit
			TEXT
			PRIMARY KEY,
		data
			TEXT
			NOT NULL
	);
`);

// Define all our queries
const updateUserResponseQuery = db.prepare(`
	INSERT INTO responses (reddit, data) VALUES (:reddit, :data)
	ON CONFLICT (reddit) DO UPDATE SET data=excluded.data
`);
const getUserResponseQuery = db.prepare(`
	SELECT * FROM responses WHERE reddit=?
`);
const deleteUserResponseQuery = db.prepare(`
	DELETE FROM responses WHERE reddit=?
`);

module.exports = {
	updateUserResponse: updateUserResponseQuery.run.bind(updateUserResponseQuery),
	getUserResponse: getUserResponseQuery.get.bind(getUserResponseQuery),
	deleteUserResponse: deleteUserResponseQuery.run.bind(deleteUserResponseQuery),
};
