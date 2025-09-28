-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  pretasks TEXT, --JSON array of questions
  attendees TEXT -- JSON array of attendee names
);

-- Join table between users and meetings with responses and prompts
CREATE TABLE IF NOT EXISTS user_meeting_responses (
  (meeting_id, uid) INTEGER PRIMARY KEY AUTOINCREMENT,
  uid TEXT NOT NULL,
  meeting_id INTEGER NOT NULL,
  responses TEXT, -- JSON object
  prompt TEXT, -- JSON object
  FOREIGN KEY (meeting_id) REFERENCES meetings(id),
  FOREIGN KEY (uid) REFERENCES users(name)
);