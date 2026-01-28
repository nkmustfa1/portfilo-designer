import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';
import { useLanguage } from '@/context/LanguageContext';

interface ProjectDB {
  id: string;
  slug: string;

  title_en: string;
  title_ar: string;

  description_en: string | null;
  description_ar: string | null;

  client_en: string | null;
  client_ar: string | null;

  concept_en: string | null;
  concept_ar: string | null;

  design_system_en: string | null;
  design_system_ar: string | null;

  execution_en: string | null;
  execution_ar: string | null;

  category: string;
  year: string | null;
  tools: string[];
  main_image: string | null;
  gallery_images: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  client: string | null;
  year: string | null;
  tools: string[];
  main_image: string | null;
  gallery_images: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
  // Design Process fields
  concept: string | null;
  design_system: string | null;
  execution: string | null;
}

export interface ProjectInput {
  slug: string;
  category: string;
  year?: string;
  tools?: string[];
  main_image?: string;
  gallery_images?: string[];
  featured?: boolean;

  // English
  title_en: string;
  description_en?: string;
  client_en?: string;
  concept_en?: string;
  design_system_en?: string;
  execution_en?: string;

  // Arabic
  title_ar: string;
  description_ar?: string;
  client_ar?: string;
  concept_ar?: string;
  design_system_ar?: string;
  execution_ar?: string;
}


export function useFeaturedProjects() {
  return useQuery({
    queryKey: ['featured-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    }
  });
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from('projects')
        .update({ featured })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['featured-projects'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update featured status: ${error.message}`);
    }
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    }
  });
}

export function useProject(slug: string) {
  const { lang } = useLanguage();
  const isArabic = lang === 'ar';

  return useQuery({
    queryKey: ['project', slug, lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .maybeSingle<ProjectDB>();

      if (error) throw error;
      if (!data) return null;

      // 🔥 التحويل الذكي
      const localizedProject: Project = {
        id: data.id,
        slug: data.slug,

        title: isArabic ? data.title_ar : data.title_en,
        description: isArabic ? data.description_ar : data.description_en,
        client: isArabic ? data.client_ar : data.client_en,

        concept: isArabic ? data.concept_ar : data.concept_en,
        design_system: isArabic
          ? data.design_system_ar
          : data.design_system_en,
        execution: isArabic ? data.execution_ar : data.execution_en,

        category: data.category,
        year: data.year,
        tools: data.tools,
        main_image: data.main_image,
        gallery_images: data.gallery_images,
        featured: data.featured,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return localizedProject;
    },
    enabled: !!slug,
  });
}


export function useProjectById(id: string) {
  return useQuery({
    queryKey: ['project-by-id', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Project | null;
    },
    enabled: !!id
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (project: ProjectInput) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create project: ${error.message}`);
    }
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...project }: ProjectInput & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update project: ${error.message}`);
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    }
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {

      // 🔹 ضغط الصورة قبل الرفع
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);

      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('project-images')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      return publicUrl;
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload image: ${error.message}`);
    }
  });
}

