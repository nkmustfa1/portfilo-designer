import { cn } from '@/lib/utils';

interface GlassBackgroundProps {
  className?: string;
  variant?: 'default' | 'hero' | 'section' | 'footer';
}

/**
 * Background with glowing color spots on corners over dark background
 * Using HK brand identity colors: teal, cyan, deep blue, orange/coral
 */
export function GlassBackground({ className, variant = 'default' }: GlassBackgroundProps) {
  if (variant === 'hero') {
    return (
      <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {/* Top-left teal glow */}
        <div 
          className="absolute top-[-150px] left-[-100px] w-[700px] h-[700px] rounded-full blur-[140px]"
          style={{
            background: 'radial-gradient(circle, hsl(175 55% 55%) 0%, transparent 55%)',
            opacity: 0.7,
          }}
        />
        
        {/* Top-right orange glow */}
        <div 
          className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full blur-[130px]"
          style={{
            background: 'radial-gradient(circle, hsl(20 90% 58%) 0%, transparent 55%)',
            opacity: 0.6,
          }}
        />
        
        {/* Center cream glow */}
        <div 
          className="absolute top-[30%] left-[40%] w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{
            background: 'radial-gradient(circle, hsl(40 70% 80%) 0%, transparent 60%)',
            opacity: 0.4,
          }}
        />
        
        {/* Bottom teal */}
        <div 
          className="absolute bottom-[-100px] left-[5%] w-[800px] h-[800px] rounded-full blur-[150px]"
          style={{
            background: 'radial-gradient(circle, hsl(185 60% 50%) 0%, transparent 55%)',
            opacity: 0.5,
          }}
        />
        
        {/* Bottom-right orange */}
        <div 
          className="absolute bottom-[-150px] right-[10%] w-[800px] h-[800px] rounded-full blur-[150px]"
          style={{
            background: 'radial-gradient(circle, hsl(25 85% 55%) 0%, transparent 55%)',
            opacity: 0.6,
          }}
        />
        
        {/* Middle teal for scroll */}
        <div 
          className="absolute top-[60%] left-[20%] w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{
            background: 'radial-gradient(circle, hsl(175 50% 50%) 0%, transparent 60%)',
            opacity: 0.4,
          }}
        />
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={cn('absolute inset-0 overflow-hidden', className)}>
        {/* Base background using theme */}
        <div className="absolute inset-0 bg-background" />
        
        {/* Bottom-left teal glow */}
        <div 
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-55"
          style={{
            background: 'radial-gradient(circle, hsl(175 55% 55%) 0%, transparent 70%)',
          }}
        />
        
        {/* Bottom-center orange glow */}
        <div 
          className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full blur-[100px] opacity-45"
          style={{
            background: 'radial-gradient(circle, hsl(25 85% 55%) 0%, transparent 70%)',
          }}
        />
        
        {/* Bottom-right teal glow */}
        <div 
          className="absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full blur-[100px] opacity-50"
          style={{
            background: 'radial-gradient(circle, hsl(180 50% 50%) 0%, transparent 70%)',
          }}
        />
        
        {/* Subtle blue accent - reduced */}
        <div 
          className="absolute bottom-1/4 right-0 w-[250px] h-[250px] rounded-full blur-[80px] opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(200 60% 40%) 0%, transparent 70%)',
          }}
        />
      </div>
    );
  }

  // Default and section variants - pure themed background
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-background" />
    </div>
  );
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * Glass morphism card component - theme aware
 */
export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-border/20 bg-card/50 backdrop-blur-xl',
        'shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]',
        hover && 'transition-all duration-300 hover:bg-card/70 hover:border-border/30 hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Glass panel for sections - theme aware
 */
export function GlassPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative rounded-xl border border-border/20 bg-card/50 backdrop-blur-md',
        className
      )}
    >
      {children}
    </div>
  );
}
