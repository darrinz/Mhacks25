-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id SERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  pretasks jsonb, --JSON array of questions
  attendees jsonb -- JSON array of attendee names
);

-- Join table between users and meetings with responses and prompts
CREATE TABLE IF NOT EXISTS user_meeting_responses (
  email TEXT NOT NULL,
  meeting_id INTEGER NOT NULL,
  responses jsonb, -- JSON object
  prompt jsonb, -- JSON object
  PRIMARY KEY (meeting_id, email),
  FOREIGN KEY (meeting_id) REFERENCES meetings(id)
);

