import type { Project } from '@/hooks/useProjects';
import type { UIProject } from '@/types/project-ui';

export function mapProjectToUI(p: Project): UIProject {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category as UIProject['category'],
    year: p.year || new Date().getFullYear().toString(),
    coverImage: p.main_image || '/placeholder.svg',
  };
}
