import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProjectById, useCreateProject, useUpdateProject, useUploadImage, ProjectInput } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Upload, X, Plus } from 'lucide-react';
import { GlassBackground, GlassCard } from '@/components/ui/GlassBackground';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CATEGORIES = ['branding', 'print', 'packaging', 'illustration', 'digital', 'social-media', 'ai', 'merchandise', 'others'];

export default function AdminProjectEditor() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { data: existingProject, isLoading: projectLoading } = useProjectById(isNew ? '' : id || '');
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const uploadImage = useUploadImage();
  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryImageRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProjectInput>({
  slug: '',
  category: 'branding',
  year: new Date().getFullYear().toString(),
  tools: [],
  main_image: '',
  gallery_images: [],

  // English
  title_en: '',
  description_en: '',
  client_en: '',
  concept_en: '',
  design_system_en: '',
  execution_en: '',

  // Arabic
  title_ar: '',
  description_ar: '',
  client_ar: '',
  concept_ar: '',
  design_system_ar: '',
  execution_ar: '',
});

  const [toolInput, setToolInput] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

 useEffect(() => {
  if (existingProject && !isNew) {
    setFormData({
      slug: existingProject.slug,
      category: existingProject.category,
      year: existingProject.year || '',
      tools: existingProject.tools || [],
      main_image: existingProject.main_image || '',
      gallery_images: existingProject.gallery_images || [],

      title_en: existingProject.title_en,
      description_en: existingProject.description_en,
      client_en: existingProject.client_en,
      concept_en: existingProject.concept_en,
      design_system_en: existingProject.design_system_en,
      execution_en: existingProject.execution_en,

      title_ar: existingProject.title_ar,
      description_ar: existingProject.description_ar,
      client_ar: existingProject.client_ar,
      concept_ar: existingProject.concept_ar,
      design_system_ar: existingProject.design_system_ar,
      execution_ar: existingProject.execution_ar,
    });
  }
}, [existingProject, isNew]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug
    }));
  };

  const handleImageUpload = async (file: File, type: 'main' | 'gallery') => {
    setUploading(true);
    try {
      const url = await uploadImage.mutateAsync(file);
      if (type === 'main') {
        setFormData(prev => ({ ...prev, main_image: url }));
      } else {
        setFormData(prev => ({
          ...prev,
          gallery_images: [...(prev.gallery_images || []), url]
        }));
      }
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images?.filter((_, i) => i !== index) || []
    }));
  };

  const addTool = () => {
    if (toolInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tools: [...(prev.tools || []), toolInput.trim()]
      }));
      setToolInput('');
    }
  };

  const removeTool = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNew) {
      await createProject.mutateAsync(formData);
    } else if (id) {
      await updateProject.mutateAsync({ id, ...formData });
    }
    
    navigate('/admin');
  };

  const isSubmitting = createProject.isPending || updateProject.isPending;

  if (authLoading || (!isNew && projectLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GlassBackground variant="hero" />
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{isNew ? 'New Project' : 'Edit Project'}</h1>
              <p className="text-muted-foreground">
                {isNew ? 'Add a new project to your portfolio' : 'Update project details'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <GlassCard className="border-glass-border">
              <CardHeader>
                <CardTitle className="text-foreground">Basic Information</CardTitle>
              </CardHeader>
           <CardContent className="space-y-6">
  <Tabs defaultValue="en">
    <TabsList className="grid grid-cols-2 w-48">
      <TabsTrigger value="en">English</TabsTrigger>
      <TabsTrigger value="ar">العربية</TabsTrigger>
    </TabsList>

    {/* English */}
    <TabsContent value="en" className="space-y-4">
      <div className="space-y-2">
        <Label>Title (English)</Label>
        <Input
          value={formData.title_en}
          onChange={(e) =>
            setFormData(p => ({ ...p, title_en: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Description (English)</Label>
        <Textarea
          value={formData.description_en}
          onChange={(e) =>
            setFormData(p => ({ ...p, description_en: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Client (English)</Label>
        <Input
          value={formData.client_en}
          onChange={(e) =>
            setFormData(p => ({ ...p, client_en: e.target.value }))
          }
        />
      </div>
    </TabsContent>

    {/* Arabic */}
    <TabsContent value="ar" className="space-y-4">
      <div className="space-y-2">
        <Label>العنوان</Label>
        <Input
          dir="rtl"
          value={formData.title_ar}
          onChange={(e) =>
            setFormData(p => ({ ...p, title_ar: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label>الوصف</Label>
        <Textarea
          dir="rtl"
          value={formData.description_ar}
          onChange={(e) =>
            setFormData(p => ({ ...p, description_ar: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label>العميل</Label>
        <Input
          dir="rtl"
          value={formData.client_ar}
          onChange={(e) =>
            setFormData(p => ({ ...p, client_ar: e.target.value }))
          }
        />
      </div>
    </TabsContent>
  </Tabs>
</CardContent>

            </GlassCard>

            {/* Design Process Section */}
            <GlassCard className="border-glass-border">
              <CardHeader>
                <CardTitle className="text-foreground">Design Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
  <Tabs defaultValue="en">
    <TabsList className="grid grid-cols-2 w-48">
      <TabsTrigger value="en">English</TabsTrigger>
      <TabsTrigger value="ar">العربية</TabsTrigger>
    </TabsList>

    {/* English */}
    <TabsContent value="en" className="space-y-4">
      <div className="space-y-2">
        <Label>Concept (EN)</Label>
        <Textarea
          value={formData.concept_en}
          onChange={(e) =>
            setFormData(p => ({ ...p, concept_en: e.target.value }))
          }
          placeholder="Understanding the vision, goals, and context..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Design System (EN)</Label>
        <Textarea
          value={formData.design_system_en}
          onChange={(e) =>
            setFormData(p => ({ ...p, design_system_en: e.target.value }))
          }
          placeholder="Visual language, typography, colors..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Execution (EN)</Label>
        <Textarea
          value={formData.execution_en}
          onChange={(e) =>
            setFormData(p => ({ ...p, execution_en: e.target.value }))
          }
          placeholder="Bringing the design to life..."

            </GlassCard>

            <GlassCard className="border-glass-border">
              <CardHeader>
                <CardTitle className="text-foreground">Images</CardTitle>
              </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Main Image</Label>
                <input
                  ref={mainImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'main');
                  }}
                />
                {formData.main_image ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.main_image}
                      alt="Main"
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, main_image: '' }))}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => mainImageRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload Main Image
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <input
                  ref={galleryImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'gallery');
                  }}
                />
                <div className="flex gap-4 flex-wrap">
                  {formData.gallery_images?.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-32 h-32"
                    onClick={() => galleryImageRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6" />}
                  </Button>
                </div>
              </div>
              </CardContent>
            </GlassCard>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isNew ? 'Create Project' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
