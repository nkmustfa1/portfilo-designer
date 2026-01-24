-- Add design process fields to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS concept TEXT,
ADD COLUMN IF NOT EXISTS design_system TEXT,
ADD COLUMN IF NOT EXISTS execution TEXT;