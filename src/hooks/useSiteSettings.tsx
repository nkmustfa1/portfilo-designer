import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type LocalizedText = {
  en: string;
  ar: string;
};

export interface WorkExperience {
  id: string;
  company: LocalizedText;
  role: LocalizedText;
  description: LocalizedText;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  title: LocalizedText;
  issuer: LocalizedText;
  year: string;
  type: 'certification' | 'award';
}


export interface DesignerInfo {
  name: string; // خليه كما هو (اسم واحد فقط)

  tagline?: LocalizedText;
  heroIntroduction?: LocalizedText;
  biography?: LocalizedText;
    heroQuote?: {
    en: string;
    ar: string;
  };
  philosophy?: LocalizedText;
  approach?: LocalizedText;

  skills: string[];
  clients: string[];

  workExperience: WorkExperience[];
  certifications: Certification[];
availability: {
  en?: string;
  ar?: string;
};

education: {
  en?: string;
  ar?: string;
};

  location: string;
  email: string;
  phone: string;
 
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


export interface HomeSettings {
  heroImage: string;

  heroBadge?: LocalizedText;
  heroTitle?: LocalizedText;
  heroSubtitle?: LocalizedText;

  ctaPortfolio?: LocalizedText;
  aboutTitle?: LocalizedText;
  learnMore?: LocalizedText;
  featuredLabel?: LocalizedText;
  featuredTitle?: LocalizedText;
  viewAll?: LocalizedText;
}



export interface FooterNavLink {
  name: string;
  path: string;
}

export interface FooterSocialLink {
  platform: 'instagram' | 'linkedin' | 'behance' | 'dribbble' | 'twitter' | 'youtube' | 'facebook' | 'tiktok' | 'pinterest' | 'github';
  url: string;
}

export interface FooterSettings {
  copyrightText: string;
  showNavigation: boolean;
  showSocialLinks: boolean;
  navigationLinks: FooterNavLink[];
  socialLinks: FooterSocialLink[];
}

export interface BrandSettings {
  logoUrl: string;
  useLogo: boolean;
  headerLogoSize: 'small' | 'medium' | 'large';
  footerLogoSize: 'small' | 'medium' | 'large';
}

export function useSiteSettings<T>(key: string) {
  return useQuery({
    queryKey: ['site_settings', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();
      
      if (error) throw error;
      return data?.value as T | null;
    }
  });
}

export function useDesignerInfo() {
  return useSiteSettings<DesignerInfo>('designer_info');
}

export function useHomeSettings() {
  return useSiteSettings<HomeSettings>('home_settings');
}

export function useFooterSettings() {
  return useSiteSettings<FooterSettings>('footer_settings');
}

export function useBrandSettings() {
  return useSiteSettings<BrandSettings>('brand_settings');
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
      // First try to update existing record
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();
      
      if (existing) {
        const { data, error } = await supabase
          .from('site_settings')
          .update({ value: value as any })
          .eq('key', key)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('site_settings')
          .insert({ key, value: value as any })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate specific key and also refetch all site_settings queries
      queryClient.invalidateQueries({ queryKey: ['site_settings', variables.key] });
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      toast.success('Settings saved successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save settings: ${error.message}`);
    }
  });
}
