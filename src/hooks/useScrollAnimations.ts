import { useRef } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

// Type-safe easing curve
const smoothEase = [0.22, 1, 0.36, 1] as const;

/**
 * Custom hook for scroll-based animations
 * Provides various animation values for creating parallax and reveal effects
 */
export function useScrollAnimations(options?: {
  offset?: ['start end' | 'start start' | 'end start' | 'end end', 'start end' | 'start start' | 'end start' | 'end end'];
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: options?.offset || ['start end', 'end start']
  });

  // Smooth spring animation for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Common animation values
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const fadeInOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const parallaxYSlow = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const parallaxYFast = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [10, 0]);

  return {
    ref,
    scrollYProgress,
    smoothProgress,
    opacity,
    fadeInOpacity,
    scale,
    y,
    parallaxY,
    parallaxYSlow,
    parallaxYFast,
    rotateX
  };
}

/**
 * Hook for staggered children animations
 */
export function useStaggerChildren(staggerDelay = 0.1) {
  return {
    container: {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true, margin: '-50px' },
      transition: { staggerChildren: staggerDelay }
    },
    item: {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6, ease: smoothEase }
    }
  };
}

/**
 * Animation variants for common patterns
 */
export const scrollAnimationVariants = {
  fadeUp: {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.7, ease: 'easeOut' as const }
  },
  fadeDown: {
    initial: { opacity: 0, y: -40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.7, ease: 'easeOut' as const }
  },
  fadeLeft: {
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.7, ease: 'easeOut' as const }
  },
  fadeRight: {
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.7, ease: 'easeOut' as const }
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.7, ease: 'easeOut' as const }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -100 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.8, ease: 'easeOut' as const }
  },
  slideInRight: {
    initial: { opacity: 0, x: 100 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.8, ease: 'easeOut' as const }
  },
  revealLine: {
    initial: { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: { once: true },
    transition: { duration: 1, ease: 'easeOut' as const }
  },
  staggerContainer: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: '-50px' },
    transition: { staggerChildren: 0.1 }
  },
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' as const }
  }
} as const;

/**
 * Creates a stagger delay based on index
 */
export function getStaggerDelay(index: number, baseDelay = 0.1): number {
  return index * baseDelay;
}
