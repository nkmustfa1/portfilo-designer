import { useState, useMemo, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project, ProjectCategory } from '@/types';
import { useLanguage } from "@/context/LanguageContext";

interface InteractivePortfolioGridProps {
  projects: Project[];
}
type FilterCategory = 'all' | ProjectCategory;

const getCategories = (lang: "en" | "ar"): {
  value: FilterCategory;
  label: string;
}[] => [
  { value: 'all', label: lang === 'ar' ? 'كل الأعمال' : 'All Work' },
  { value: 'branding', label: lang === 'ar' ? 'الهوية' : 'Branding' },
  { value: 'print', label: lang === 'ar' ? 'مطبوعات' : 'Print' },
  { value: 'social-media', label: lang === 'ar' ? 'سوشيال ميديا' : 'Social Media' },
  { value: 'ai', label: 'AI' },
  { value: 'packaging', label: lang === 'ar' ? 'التغليف' : 'Packaging' },
  { value: 'merchandise', label: lang === 'ar' ? 'منتجات' : 'Merchandise' },
  { value: 'others', label: lang === 'ar' ? 'أخرى' : 'Others' },
];


// 3D Tilt Card Component with mouse tracking
const ParallaxProjectCard = forwardRef<HTMLDivElement, { 
  project: Project; 
  index: number;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}>(function ParallaxProjectCard({ 
  project, 
  index, 
  hoveredId, 
  setHoveredId 
}, forwardedRef) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    if (cardRef.current) {
      setIsMounted(true);
    }
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: isMounted ? cardRef : undefined,
    offset: ['start end', 'end start']
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const cardScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  // Handle mouse move for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setHoveredId(project.id);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setHoveredId(null);
    setMousePosition({ x: 0.5, y: 0.5 });
  };

  // Calculate 3D rotation based on mouse position
  const rotateX = isHovering ? (mousePosition.y - 0.5) * -20 : 0;
  const rotateY = isHovering ? (mousePosition.x - 0.5) * 20 : 0;
  
  // Calculate shine position
  const shineX = mousePosition.x * 100;
  const shineY = mousePosition.y * 100;

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        duration: 0.4,
        delay: index * 0.05,
        layout: { duration: 0.4 }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group"
      style={{ 
        perspective: '1200px',
        scale: cardScale,
        opacity: cardOpacity
      }}
    >
      <Link
        to={`/project/${project.slug}`}
        className="block relative"
      >
        <motion.div
          className="relative overflow-hidden rounded-xl bg-muted/50"
          animate={{
            rotateX,
            rotateY,
            scale: isHovering ? 1.02 : 1,
            z: isHovering ? 50 : 0,
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 400, 
            damping: 25,
            mass: 0.5
          }}
          style={{ 
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center'
          }}
        >
          {/* Image with Parallax */}
          <div className="aspect-[4/3] overflow-hidden">
            <motion.div
              className="w-full h-[130%] -mt-[15%]"
              style={{ y: imageY }}
            >
              <motion.img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
                animate={{
                  scale: isHovering ? 1.15 : 1,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </motion.div>
          </div>

          {/* Hover Overlay with 3D depth */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ transform: 'translateZ(20px)' }}
          >
            {/* Category Badge */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovering ? 1 : 0,
                y: isHovering ? 0 : 10
              }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="inline-flex self-start px-3 py-1 mb-3 text-xs font-medium uppercase tracking-wider bg-white/20 backdrop-blur-sm rounded-full text-white"
            >
              {project.category}
            </motion.span>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isHovering ? 1 : 0,
                y: isHovering ? 0 : 20
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-xl md:text-2xl font-light text-white mb-2"
            >
              {project.title}
            </motion.h3>

            {/* View Project */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isHovering ? 1 : 0,
                y: isHovering ? 0 : 20
              }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex items-center gap-2 text-sm text-white/80"
            >
              <span>View Project</span>
              <ArrowUpRight className="size-4" />
            </motion.div>
          </motion.div>

          {/* Dynamic Shine Effect following mouse */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.25) 0%, transparent 50%)`,
            }}
          />

          {/* Edge highlight for 3D effect */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{
              opacity: isHovering ? 1 : 0,
              boxShadow: isHovering 
                ? `inset 0 0 0 1px rgba(255,255,255,0.2),
                   0 25px 50px -12px rgba(0,0,0,0.5),
                   0 0 0 1px rgba(255,255,255,0.1)`
                : 'none'
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Info Below Card with subtle 3D lift */}
        <motion.div 
          className="mt-4 space-y-1"
          animate={{
            y: isHovering ? -5 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="capitalize">{project.category}</span>
            {project.year && (
              <>
                <span>•</span>
                <span>{project.year}</span>
              </>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
});

export function InteractivePortfolioGrid({ projects }: InteractivePortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'all'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { lang } = useLanguage();

  const categories = getCategories(lang);
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [projects, activeFilter]);

  // Get available categories from projects
  const availableCategories = useMemo(() => {
    const projectCategories = new Set(projects.map(p => p.category));
    return categories.filter(c => c.value === 'all' || projectCategories.has(c.value as ProjectCategory));
  }, [projects]);

  return (
    <div className="space-y-12">
      {/* Filter Tabs */}
      <motion.div 
        className="flex flex-wrap justify-center gap-2 md:gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {availableCategories.map((category) => (
          <button
            key={category.value}
            onClick={() => setActiveFilter(category.value)}
            className={cn(
              'relative px-5 py-2.5 text-sm font-medium tracking-wide rounded-full transition-all duration-300',
              activeFilter === category.value
                ? 'text-background'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {activeFilter === category.value && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-foreground rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <ParallaxProjectCard
              key={project.id}
              project={project}
              index={index}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-muted-foreground">No projects found in this category.</p>
        </motion.div>
      )}
    </div>
  );
}
