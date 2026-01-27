import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useDesignerInfo, useHomeSettings } from '@/hooks/useSiteSettings';
import { useFeaturedProjects } from '@/hooks/useProjects';
import { photographerInfo } from '@/data/photographer';
import { FeaturedProjectsCarousel } from '@/components/portfolio/FeaturedProjectsCarousel';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { GlassBackground } from '@/components/ui/GlassBackground';
import { SEOHead } from '@/components/seo/SEOHead';
import { LoadingFallback } from '@/components/ui/LoadingFallback';
import { GlassCard } from '@/components/ui/GlassBackground';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { scrollAnimationVariants } from '@/hooks/useScrollAnimations';

import { useLanguage } from "@/context/LanguageContext";



/**
 * Homepage with immersive hero section and featured projects grid
 * Features scroll-based animations and parallax effects
 */
export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
const { lang } = useLanguage();

useEffect(() => {
  const onResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);

const pickLang = (obj?: { en?: string; ar?: string }) => {
  if (!obj) return "";
  return lang === "ar" ? obj.ar || obj.en : obj.en;
};
const pickValue = (
  en?: string,
  ar?: string
) => (lang === "ar" ? ar || en : en);

  const { data: dbFeaturedProjects, isLoading: isFeaturedLoading } = useFeaturedProjects();
  const { data: designerInfo, isLoading: isDesignerLoading } = useDesignerInfo();
  const { data: homeSettings, isLoading: isHomeLoading } = useHomeSettings();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHeroMounted, setIsHeroMounted] = useState(false);
  
  useEffect(() => {
    if (heroRef.current) {
      setIsHeroMounted(true);
    }
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: isHeroMounted ? heroRef : undefined,
    offset: ['start start', 'end start']
  });
  


  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroContentY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);



  // Use database featured projects if available, otherwise fallback to static
const featuredProjects = dbFeaturedProjects?.map(p => ({
  id: p.id,
  title: p.title,
  category: p.category,
  year: p.year || '',
  slug: p.slug,
  coverImage: p.main_image || '',
  description: p.description || '',
  client: p.client || '',
  tools: p.tools?.join(', ') || '',
  location: '',
  images: (p.gallery_images || []).map((img, i) => ({
    id: `${p.id}-${i}`,
    src: img,
    alt: `${p.title} image ${i + 1}`,
    aspectRatio: 'landscape' as const
  }))
})) || [];


  // Merge database settings with fallback static data
const name = pickValue(
  designerInfo?.name,
  (designerInfo as any)?.name_ar
);

const tagline = pickValue(
  designerInfo?.tagline,
  (designerInfo as any)?.tagline_ar
);

const heroIntroduction = pickValue(
  designerInfo?.heroIntroduction,
  (designerInfo as any)?.heroIntroduction_ar
);

const biography = pickValue(
  designerInfo?.biography,
  (designerInfo as any)?.biography_ar
);

const heroImage = homeSettings?.heroImage;
const heroBadge = pickLang(homeSettings?.heroBadge);
const heroTitle = pickLang(homeSettings?.heroTitle);
const heroSubtitle = pickLang(homeSettings?.heroSubtitle);

const ctaPortfolio = pickLang(homeSettings?.ctaPortfolio);
const aboutTitle = pickLang(homeSettings?.aboutTitle);
const learnMore = pickLang(homeSettings?.learnMore);
const featuredLabel = pickLang(homeSettings?.featuredLabel);
const featuredTitle = pickLang(homeSettings?.featuredTitle);
const viewAll = pickLang(homeSettings?.viewAll);

  if (
  isDesignerLoading ||
  isHomeLoading ||
  isFeaturedLoading ||
  !designerInfo ||
  !homeSettings
) {
  return <LoadingFallback />;
}



  return (
    <>
      <SEOHead />
      
      <div className="min-h-screen relative overflow-hidden">
       {/* Mobile fast background (ONLY mobile) */}
<div className="mobile-brand-bg md:hidden absolute inset-0 z-0" />

        {/* Glass Background Effect with Brand Pattern - covers full page */}
      <div className="hidden md:block">
  <GlassBackground variant="hero" />
</div>

        {/* Hero Section - Full viewport with parallax hero image */}
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden" style={{ zIndex: 1 }}>
          {/* Hero image with parallax */}
          {heroImage && (
            <motion.div 
  className="absolute inset-0"
  style={isMobile ? {} : { y: heroImageY, scale: heroImageScale }}
>

              <img
                src={heroImage}
                alt="Creative design workspace"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay - fades to dark at bottom */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
            </motion.div>
          )}

          {/* Hero Content with scroll fade */}
          <motion.div 
  className="relative h-full flex flex-col items-center justify-center px-6 z-10"
  style={isMobile ? {} : { opacity: heroContentOpacity, y: heroContentY }}
>

            <motion.div
              className="text-center space-y-8 max-w-4xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <GlassCard className="inline-flex items-center gap-2 px-4 py-2 mb-6" hover={false}>
<span className="text-sm font-medium text-foreground/80">
{heroBadge}

</span>
                </GlassCard>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wide text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
              
                 {heroTitle || name}


              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {tagline}
              </motion.p>

              <motion.p
                className="text-base md:text-lg font-light leading-relaxed text-muted-foreground/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                {heroIntroduction}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-foreground font-medium transition-all hover:scale-105"
                >
                  <span>{ctaPortfolio}</span>

                  <ArrowRight className="size-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <ScrollIndicator />
            </motion.div>
          </motion.div>
        </section>

        {/* Introduction Section */}
        <section className="relative py-24 md:py-32 px-6 lg:px-8 overflow-hidden" style={{ zIndex: 1 }}>
          <div className="relative max-w-4xl mx-auto text-center z-10">
            <motion.div
              {...scrollAnimationVariants.fadeUp}
              className="space-y-6"
            >
              <motion.div
                {...scrollAnimationVariants.revealLine}
                className="w-16 h-px bg-foreground/20 mx-auto mb-8 origin-left"
              />
              
             
              <motion.h2 
                className="text-3xl md:text-4xl font-light tracking-wide text-foreground"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                    {aboutTitle}
              </motion.h2>
              
              <motion.p 
                className="text-lg font-light leading-relaxed text-muted-foreground"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
               {biography ? biography.split('\n\n')[0] : ""}


              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-base font-light tracking-wide text-foreground hover:text-primary transition-colors group"
                >
                <span>{learnMore}</span>

                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

       {/* Featured Projects Section */}
<section className="relative py-20 md:py-28 overflow-hidden" style={{ zIndex: 1 }}>
  <div className="px-4 md:px-8 lg:px-12">

    {/* Section Header */}
    <motion.div
      {...scrollAnimationVariants.staggerContainer}
      className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4"
    >
      <motion.div {...scrollAnimationVariants.fadeLeft} className="space-y-2">
        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
{featuredLabel}
</span>

<h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-foreground">
{featuredTitle}
</h2>

      </motion.div>

      <motion.div {...scrollAnimationVariants.fadeRight}>
        <Link
          to="/portfolio"
          className="group inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
        >
         <span className="font-medium">
{viewAll}
</span>

          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </motion.div>

    {/* Carousel */}
    <motion.div {...scrollAnimationVariants.scaleUp}>
      {isFeaturedLoading ? (
        <LoadingFallback />
      ) : (
        <FeaturedProjectsCarousel projects={featuredProjects} />
      )}
    </motion.div>

  </div>
</section>

      </div>
    </>
  );
}