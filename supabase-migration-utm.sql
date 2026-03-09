-- UTM Tracking Columns for assessments table
-- Run this in Supabase Dashboard → SQL Editor

ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_term TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT,
  ADD COLUMN IF NOT EXISTS click_id TEXT;

-- Add a comment for documentation
COMMENT ON COLUMN assessments.click_id IS 'Stores gclid (Google) or msclkid (Bing) click IDs';
