export interface UIProject {
  id: string;
  title: string;
  slug: string;
  category: 'branding' | 'print' | 'social-media' | 'ai' | 'packaging' | 'merchandise' | 'others';
  year: string;
  coverImage: string;
}
