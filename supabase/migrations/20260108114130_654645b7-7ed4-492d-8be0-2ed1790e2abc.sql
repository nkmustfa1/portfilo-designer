-- Create site_settings table for global website configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Site settings are viewable by everyone" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can insert settings" 
ON public.site_settings 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings" 
ON public.site_settings 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete settings" 
ON public.site_settings 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES 
('designer_info', '{
  "name": "Hadeel Mohammed",
  "tagline": "Graphic Designer",
  "heroIntroduction": "I create visual stories that connect brands with their audiences through thoughtful design.",
  "biography": "I am a passionate graphic designer with over 5 years of experience creating compelling visual identities, print materials, and digital designs. My approach combines strategic thinking with creative execution to deliver designs that not only look beautiful but also effectively communicate your brand message.",
  "approach": "Every project begins with understanding your unique story, goals, and audience. I believe great design is born from collaboration and attention to detail.",
  "skills": ["Brand Identity", "Logo Design", "Print Design", "Packaging", "Illustration", "Digital Design", "Typography", "Adobe Creative Suite"],
  "clients": ["Local Startups", "Small Businesses", "Creative Agencies"],
  "education": "Bachelor of Fine Arts in Graphic Design",
  "location": "Creative Studio",
  "email": "hello@hadeelmohammed.com",
  "phone": "+1 (555) 123-4567",
  "availability": "Available for new projects",
  "socialLinks": {
    "instagram": "https://instagram.com",
    "linkedin": "https://linkedin.com",
    "behance": "https://behance.net",
    "dribbble": "https://dribbble.com"
  },
  "portraitImage": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800"
}'::jsonb),
('home_settings', '{
  "heroImage": "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1920&q=80",
  "heroTitle": "Creative Design Solutions",
  "heroSubtitle": "Bringing your vision to life through thoughtful design"
}'::jsonb);