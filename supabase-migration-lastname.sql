-- Add last_name column to assessments table
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS last_name TEXT;
