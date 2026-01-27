import { projects as staticProjects } from '@/data/projects';
import { useProjects } from '@/hooks/useProjects';
import { InteractivePortfolioGrid } from '@/components/portfolio/InteractivePortfolioGrid';
import { SEOHead } from '@/components/seo/SEOHead';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { scrollAnimationVariants } from '@/hooks/useScrollAnimations';
import { GlassBackground } from '@/components/ui/GlassBackground';
import { useLanguage } from "@/context/LanguageContext";

/**
 * Portfolio page with interactive filter grid and 3D hover effects
 */
export default function Portfolio() {
  const { data: dbProjects, isLoading } = useProjects();
  const { lang } = useLanguage();
const isAr = lang === "ar";

const t = (en: string, ar: string) => (isAr ? ar : en);

  const convertedDbProjects = dbProjects?.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category as 'branding' | 'print' | 'social-media' | 'ai' | 'packaging' | 'merchandise' | 'others',
    description: p.description || '',
    client: p.client || undefined,
    year: p.year || new Date().getFullYear().toString(),
    tools: p.tools?.join(', ') || undefined,
    coverImage: p.main_image || '/placeholder.svg',
    images: p.gallery_images?.map((url, i) => ({
      id: `${p.id}-${i}`,
      src: url,
      alt: `${p.title} image ${i + 1}`,
      aspectRatio: 'landscape' as const
    })) || []
  })) || [];

  const displayProjects = convertedDbProjects.length > 0 ? convertedDbProjects : staticProjects;

  return (
    <>
     <SEOHead 
  title={t("Portfolio", "الأعمال")}
  description={t(
    "Browse my complete graphic design portfolio featuring branding, print design, packaging, illustration, and digital projects.",
    "تصفّح مجموعة مختارة من أعمالي في التصميم تشمل الهوية البصرية، المطبوعات، والتجارب الرقمية."
  )}
/>

      
     <div
  className="min-h-screen relative overflow-hidden"
  dir={isAr ? "rtl" : "ltr"}
>

        {/* Mobile fast background */}
<div className="mobile-brand-bg md:hidden absolute inset-0 z-0" />

        {/* Glass Background Effect with Brand Pattern */}
        <div className="hidden md:block">
  <GlassBackground variant="hero" />
</div>

        {/* Hero Section */}
        <section className="relative py-20 md:py-28 px-6 lg:px-8 overflow-hidden" style={{ zIndex: 1 }}>
          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Animated line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-16 h-px bg-foreground/20 origin-left"
              />
              
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block text-sm font-medium uppercase tracking-wider text-muted-foreground"
              >
                {t("Portfolio", "الأعمال")}
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-foreground"
              >
                  {t("Selected Work", "مختارات من الأعمال")}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-lg text-muted-foreground font-light tracking-wide max-w-xl"
              >
              {t(
    "A curated collection of design projects spanning branding, print, and digital experiences",
    "مجموعة مختارة من مشاريع التصميم تشمل الهوية البصرية، المطبوعات، والتجارب الرقمية"
  )}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="relative pb-24 px-4 md:px-8 lg:px-12 overflow-hidden" style={{ zIndex: 1 }}>
          <div className="relative z-10 max-w-7xl mx-auto">
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-12"
              >
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </motion.div>
            ) : (
              <motion.div
                {...scrollAnimationVariants.fadeUp}
              >
                <InteractivePortfolioGrid projects={displayProjects} />
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
