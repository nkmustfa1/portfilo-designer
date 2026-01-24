import { motion, Transition, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Refined page transition variants
 * Smooth, subtle, editorial feel
 */
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
};

/**
 * Premium easing curve for smooth, refined motion
 */
const pageTransition: Transition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  duration: 0.6,
};

/**
 * Page transition wrapper for smooth route changes
 * Provides consistent fade and subtle slide animations
 * Editorial, refined, premium feel
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ willChange: 'opacity, transform' }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger children animation container
 * For animating multiple elements in sequence
 */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export function StaggerContainer({ children, className, delay = 0 }: StaggerContainerProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual stagger item
 */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
  },
};

const staggerItemTransition: Transition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  duration: 0.5,
};

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div 
      variants={staggerItem} 
      className={className}
      transition={staggerItemTransition}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fade in animation on scroll
 */
interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function FadeIn({ children, className, delay = 0, direction = 'up' }: FadeInProps) {
  const directionOffset = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {},
  };

  const fadeTransition: Transition = {
    type: 'tween',
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    duration: 0.7,
    delay,
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={fadeTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
