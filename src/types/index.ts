/**
 * Core TypeScript interfaces for Hadeel Mohammed's Graphic Design Portfolio
 */

export type ProjectCategory = 'branding' | 'print' | 'social-media' | 'ai' | 'packaging' | 'merchandise' | 'others';

export type AspectRatio = 'portrait' | 'landscape' | 'square';

export interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  aspectRatio: AspectRatio;
  caption?: string;
}

export interface ProjectDB {
  id: string;

  title_en: string;
  title_ar: string;

  description_en?: string;
  description_ar?: string;

  client_en?: string;
  client_ar?: string;

  concept_en?: string;
  concept_ar?: string;

  design_system_en?: string;
  design_system_ar?: string;

  execution_en?: string;
  execution_ar?: string;

  category: string;
  year?: string;
  tools?: string[];
  main_image?: string;
  gallery_images?: string[];
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  year: string;
  coverImage: string;
  images: ProjectImage[];
  description: string;
  client?: string;
  tools?: string;
  location?: string;
  slug: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  type: 'certification' | 'award';
}

export interface DesignerInfo {
  name: string;
  tagline: string;
  heroIntroduction: string;
  biography: string;
  philosophy: string;
  approach: string;
  skills: string[];
  clients: string[];
  workExperience: WorkExperience[];
  certifications: Certification[];
  education: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    behance?: string;
    dribbble?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
    tiktok?: string;
    pinterest?: string;
    github?: string;
  };
  portraitImage: string;
}

// Keep for backward compatibility
export type PhotographerInfo = DesignerInfo;

export interface ContactSubmission {
  name: string;
  email: string;
  projectType: 'branding' | 'print' | 'digital' | 'other';
  message: string;
  timestamp: Date;
}
