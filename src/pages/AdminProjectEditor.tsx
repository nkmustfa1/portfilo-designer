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
    title: '',
    slug: '',
    category: 'branding',
    description: '',
    client: '',
    year: new Date().getFullYear().toString(),
    tools: [],
    main_image: '',
    gallery_images: [],
    // Design Process
    concept: '',
    design_system: '',
    execution: ''
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
        title: existingProject.title,
        slug: existingProject.slug,
        category: existingProject.category,
        description: existingProject.description || '',
        client: existingProject.client || '',
        year: existingProject.year || '',
        tools: existingProject.tools || [],
        main_image: existingProject.main_image || '',
        gallery_images: existingProject.gallery_images || [],
        // Design Process
        concept: existingProject.concept || '',
        design_system: existingProject.design_system || '',
        execution: existingProject.execution || ''
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
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Project Title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="project-slug"
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                    placeholder="Client Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Project description..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Tools Used</Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {formData.tools?.map((tool, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {tool}
                      <button type="button" onClick={() => removeTool(index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    placeholder="Add a tool (e.g., Figma, Illustrator)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTool();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTool}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              </CardContent>
            </GlassCard>

            {/* Design Process Section */}
            <GlassCard className="border-glass-border">
              <CardHeader>
                <CardTitle className="text-foreground">Design Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="concept">Concept</Label>
                  <Textarea
                    id="concept"
                    value={formData.concept}
                    onChange={(e) => setFormData(prev => ({ ...prev, concept: e.target.value }))}
                    placeholder="Understanding the vision, goals, and context to establish a clear creative direction..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">وصف المفهوم والرؤية الإبداعية للمشروع</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="design_system">Design System</Label>
                  <Textarea
                    id="design_system"
                    value={formData.design_system}
                    onChange={(e) => setFormData(prev => ({ ...prev, design_system: e.target.value }))}
                    placeholder="Developing visual language, typography, colors, and core elements that define the identity..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">نظام التصميم والعناصر البصرية المستخدمة</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="execution">Execution</Label>
                  <Textarea
                    id="execution"
                    value={formData.execution}
                    onChange={(e) => setFormData(prev => ({ ...prev, execution: e.target.value }))}
                    placeholder="Bringing the design to life across all touchpoints with precision and consistency..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">تنفيذ التصميم وتطبيقه على جميع نقاط التواصل</p>
                </div>
              </CardContent>
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
