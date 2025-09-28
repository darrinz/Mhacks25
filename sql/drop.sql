-- Drop all tables in reverse order of creation to handle foreign key constraints
DROP TABLE IF EXISTS user_meeting_responses;
DROP TABLE IF EXISTS meetings;
DROP TABLE IF EXISTS users;