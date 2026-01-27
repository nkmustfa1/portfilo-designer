import { useState, useRef, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { getProjectBySlug } from '@/data/projects';
import { useProject } from '@/hooks/useProjects';
import { Lightbox } from '@/components/portfolio/Lightbox';
import { cn } from '@/lib/utils';
import { GlassBackground } from '@/components/ui/GlassBackground';
import { useLanguage } from '@/context/LanguageContext';
 

/**
 * Editorial Project detail page - clean, typography-focused, minimal
 */
export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: dbProject, isLoading } = useProject(slug || '');
  const staticProject = slug ? getProjectBySlug(slug) : undefined;
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isHeroMounted, setIsHeroMounted] = useState(false);
  const isMobile = window.innerWidth < 768;
  const { lang } = useLanguage();
const isArabic = lang === 'ar';
const t = {
  back: isArabic ? 'رجوع' : 'Back',
  client: isArabic ? 'العميل' : 'Client',
  year: isArabic ? 'السنة' : 'Year',
  category: isArabic ? 'التصنيف' : 'Category',
  tools: isArabic ? 'الأدوات' : 'Tools',
  designProcess: isArabic ? 'مراحل التصميم' : 'Design Process',
  visualStory: isArabic ? 'الصور' : 'Visual Story',
  images: isArabic ? 'صورة' : 'images',
  interested: isArabic ? 'مهتم بمشروع مشابه؟' : 'Interested in a similar project?',
  viewMore: isArabic ? 'عرض المزيد من الأعمال' : 'View More Work',
};

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (heroRef.current) {
      setIsHeroMounted(true);
    }
  }, []);

  // Parallax for hero - only after mounted
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: isHeroMounted ? heroRef : undefined,
    offset: ['start start', 'end start']
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);

  // Convert database project to display format
  const project = dbProject ? {
    id: dbProject.id,
    title: dbProject.title,
    slug: dbProject.slug,
    category: dbProject.category as 'branding' | 'print' | 'packaging' | 'illustration' | 'digital',
    description: dbProject.description || '',
    client: dbProject.client || undefined,
    year: dbProject.year || new Date().getFullYear().toString(),
    tools: dbProject.tools?.join(', ') || undefined,
    location: undefined,
    coverImage: dbProject.main_image || '/placeholder.svg',
    images: dbProject.gallery_images?.map((url, i) => ({
      id: `${dbProject.id}-${i}`,
      src: url,
      alt: `${dbProject.title} image ${i + 1}`,
      aspectRatio: 'landscape' as const
    })) || [],
    // Design Process from database
    concept: dbProject.concept || null,
    design_system: dbProject.design_system || null,
    execution: dbProject.execution || null
  } : staticProject;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/404" replace />;
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryRef.current) {
      const scrollAmount = galleryRef.current.clientWidth * 0.8;
      galleryRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Design process steps - use database values if available, fallback to defaults
  const getDesignProcessValue = (field: 'concept' | 'design_system' | 'execution') => {
    if (dbProject && field in dbProject) {
      return (dbProject as any)[field] || null;
    }
    return null;
  };

  const designProcess = [
    {
      step: '01',
      title: 'Concept',
      description: getDesignProcessValue('concept') || 'Understanding the vision, goals, and context to establish a clear creative direction.'
    },
    {
      step: '02',
      title: 'Design System',
      description: getDesignProcessValue('design_system') || 'Developing visual language, typography, colors, and core elements that define the identity.'
    },
    {
      step: '03',
      title: 'Execution',
      description: getDesignProcessValue('execution') || 'Bringing the design to life across all touchpoints with precision and consistency.'
    }
  ];

  return (
    <>
      <SEOHead
        title={project.title}
        description={project.description}
        image={project.coverImage}
        type="article"
      />
      
      <div
  className="min-h-screen relative overflow-hidden"
  dir={isArabic ? 'rtl' : 'ltr'}
>

        {/* Mobile fast background */}
<div className="mobile-brand-bg md:hidden absolute inset-0 z-0" />

        {/* Glass Background Effect with Brand Pattern */}
       <div className="hidden md:block">
  <GlassBackground variant="hero" />
</div>

        {/* Hero Section */}
        <section ref={heroRef} className="relative h-screen overflow-hidden" style={{ zIndex: 1 }}>
          {/* Background Image with Parallax */}
         <motion.div
  className="absolute inset-0"
  style={isMobile ? {} : { y: heroY }}
>

            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </motion.div>

          {/* Minimal Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-8 left-8 z-20"
          >
            <Link
              to="/portfolio"
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="size-4" />
              <span>{t.back}</span>
            </Link>
          </motion.div>

          {/* Hero Content */}
         <motion.div
  className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-24"
  style={isMobile ? {} : { opacity: heroOpacity }}
>

            <div className="max-w-4xl space-y-6">
              {/* Category & Year */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center gap-4 text-sm text-foreground/60"
              >
                <span className="uppercase tracking-[0.2em]">{project.category}</span>
                <span className="w-6 h-px bg-foreground/30" />
                <span>{project.year}</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground"
              >
                {project.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-lg md:text-xl text-foreground/70 font-light max-w-2xl"
              >
                {project.description}
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* Project Meta */}
        <section className="relative py-24 md:py-32 px-8 lg:px-20 border-b border-foreground/10" style={{ zIndex: 1 }}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-12"
            >
              {project.client && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">  {t.client}</p>
                  <p className="text-lg font-light text-foreground">{project.client}</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.year}</p>
                <p className="text-lg font-light text-foreground">{project.year}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.category}</p>
                <p className="text-lg font-light text-foreground capitalize">{project.category}</p>
              </div>
              {project.tools && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.tools}</p>
                  <p className="text-lg font-light text-foreground">{project.tools}</p>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Design Process Section */}
        <section className="relative py-24 md:py-32 px-8 lg:px-20" style={{ zIndex: 1 }}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-16"
            >
              {/* Section Header */}
              <div className="flex items-center gap-6">
                <div className="w-16 h-px bg-foreground/20" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    {t.designProcess}
                </span>
              </div>

              {/* Process Steps */}
              <div className="grid md:grid-cols-3 gap-12">
                {designProcess.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-4"
                  >
                    <span className="text-xs font-mono text-muted-foreground">{item.step}</span>
                    <h3 className="text-xl font-light text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gallery Section */}
        {project.images.length > 0 && (
          <section className="relative py-24 md:py-32 border-t border-foreground/10" style={{ zIndex: 1 }}>
            {/* Section Header */}
            <div className="px-8 lg:px-20 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-end justify-between max-w-4xl mx-auto"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-px bg-foreground/20" />
                  <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    {t.visualStory}
                  </span>
                </div>

                {/* Gallery Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollGallery('left')}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Scroll left"
                  >
                    <ArrowLeft className="size-5" />
                  </button>
                  <button
                    onClick={() => scrollGallery('right')}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Scroll right"
                  >
                    <ArrowRight className="size-5" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Horizontal Scroll Gallery */}
            <div
              ref={galleryRef}
              className="flex gap-4 overflow-x-auto px-8 lg:px-20 pb-8 snap-x snap-mandatory hide-scrollbar"
            >
              {project.images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="flex-shrink-0 snap-center cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={cn(
                        'h-[50vh] md:h-[60vh] w-auto object-cover transition-transform duration-500',
                        'group-hover:scale-[1.02]'
                      )}
                      loading={index < 3 ? 'eager' : 'lazy'}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Image Count */}
            <div className="px-8 lg:px-20 mt-8">
              <div className="max-w-4xl mx-auto">
                <span className="text-xs font-mono text-muted-foreground">
                  {String(project.images.length).padStart(2, '0')} {t.images}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="relative py-32 md:py-48 px-8 lg:px-20 border-t border-foreground/10" style={{ zIndex: 1 }}>
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <p className="text-lg text-muted-foreground font-light">
                {t.interested}
              </p>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-3 text-2xl md:text-3xl font-light text-foreground hover:opacity-70 transition-opacity group"
              >
                <span>{t.viewMore}</span>
                <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Lightbox */}
        <Lightbox
          images={project.images}
          currentIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setCurrentImageIndex}
        />
      </div>
    </>
  );
}
