import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselProject {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  category: string;
  year?: string;
  description?: string;
}

interface FeaturedProjectsCarouselProps {
  projects: CarouselProject[];
}

export function FeaturedProjectsCarousel({ projects }: FeaturedProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentProject = projects[currentIndex];

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const navigate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return prev === projects.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? projects.length - 1 : prev - 1;
    });
    setIsAutoPlaying(false);
  }, [projects.length]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  }, [currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || projects.length <= 1) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, projects.length]);

  if (!projects.length) return null;

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full"
      style={{ opacity, scale }}
    >
      {/* Main Carousel Container */}
      <div 
        className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-lg"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
            }}
            className="absolute inset-0"
          >
            <Link
              to={`/project/${currentProject.slug}`}
              className="block relative w-full h-full group"
            >
              {/* Background Image with Parallax */}
              <motion.div 
                className="absolute inset-0 overflow-hidden"
                style={{ y: imageY }}
              >
                <img
                  src={currentProject.coverImage}
                  alt={currentProject.title}
                  className="w-full h-[120%] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
              </motion.div>

              {/* Content with Parallax */}
              <motion.div 
                className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16"
                style={{ y: contentY }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="max-w-2xl space-y-4"
                >
                  {/* Category & Year */}
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider bg-white/10 backdrop-blur-sm rounded-full text-white/90">
                      {currentProject.category}
                    </span>
                    <span className="text-sm text-white/60">{currentProject.year}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-white">
                    {currentProject.title}
                  </h3>

                  {/* Description */}
                  {currentProject.description && (
                    <p className="text-base md:text-lg text-white/70 font-light line-clamp-2 max-w-xl">
                      {currentProject.description}
                    </p>
                  )}

                  {/* View Project Link */}
                  <div className="pt-4">
                    <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-4 transition-all duration-300">
                      View Project
                      <ArrowRight className="size-5" />
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {projects.length > 1 && (
          <>
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="Previous project"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="Next project"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}

        {/* Progress Indicators */}
        {projects.length > 1 && (
          <div className="absolute bottom-8 md:bottom-12 right-8 md:right-12 z-10 flex items-center gap-3">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'relative h-1 rounded-full overflow-hidden transition-all duration-300',
                  index === currentIndex ? 'w-12 bg-white/30' : 'w-6 bg-white/20 hover:bg-white/30'
                )}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === currentIndex && isAutoPlaying && (
                  <motion.div
                    className="absolute inset-0 bg-white origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                )}
                {index === currentIndex && !isAutoPlaying && (
                  <div className="absolute inset-0 bg-white" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Slide Counter */}
        <div className="absolute top-8 md:top-12 right-8 md:right-12 z-10">
          <span className="text-sm font-mono text-white/60">
            <span className="text-white font-medium">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="mx-2">/</span>
            <span>{String(projects.length).padStart(2, '0')}</span>
          </span>
        </div>
      </div>

    </motion.div>
  );
}
