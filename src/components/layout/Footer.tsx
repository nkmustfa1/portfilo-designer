import { Instagram, Linkedin, Youtube, Facebook, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { photographerInfo } from '@/data/photographer';
import { useDesignerInfo, useFooterSettings, useBrandSettings } from '@/hooks/useSiteSettings';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Custom SVG icons for platforms not in Lucide
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0a12 12 0 00-4.37 23.17c-.1-.94-.2-2.4.04-3.44l1.39-5.89s-.35-.71-.35-1.76c0-1.65.96-2.88 2.15-2.88 1.02 0 1.51.76 1.51 1.68 0 1.03-.65 2.56-.99 3.98-.28 1.19.6 2.16 1.77 2.16 2.13 0 3.77-2.25 3.77-5.5 0-2.87-2.06-4.88-5.01-4.88-3.41 0-5.42 2.56-5.42 5.21 0 1.03.4 2.14.89 2.74.1.12.11.22.08.34l-.33 1.36c-.05.22-.18.27-.41.16-1.54-.72-2.5-2.96-2.5-4.77 0-3.88 2.82-7.45 8.14-7.45 4.27 0 7.59 3.04 7.59 7.12 0 4.25-2.68 7.67-6.39 7.67-1.25 0-2.42-.65-2.82-1.42l-.77 2.93c-.28 1.07-1.03 2.42-1.54 3.24A12 12 0 1012 0z" />
  </svg>
);

const BehanceIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
  </svg>
);

const DribbbleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.424 25.424 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.814 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.686 8.686 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.66-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.654 5.715z" />
  </svg>
);

/**
 * Elegant editorial footer with centered layout
 * Features personal message, social icons with hover effects
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: designerInfo } = useDesignerInfo();
  const { data: footerSettings } = useFooterSettings();
  const { data: brandSettings } = useBrandSettings();

  const name = designerInfo?.name || photographerInfo.name;
  const designerSocialLinks = designerInfo?.socialLinks || photographerInfo.socialLinks;
  const copyrightText = footerSettings?.copyrightText || `© ${currentYear} ${name}`;
  const showSocialLinks = footerSettings?.showSocialLinks ?? true;
  const useLogo = brandSettings?.useLogo && brandSettings?.logoUrl;
  const logoUrl = brandSettings?.logoUrl;
  const footerLogoSize = brandSettings?.footerLogoSize || 'medium';
  
  const logoSizeClasses = {
    small: 'h-5',
    medium: 'h-6',
    large: 'h-8'
  };

  // Use footer-specific social links if configured, otherwise fall back to designer social links
  const footerSocialLinks = footerSettings?.socialLinks?.length 
    ? footerSettings.socialLinks 
    : Object.entries(designerSocialLinks)
        .filter(([_, url]) => url)
        .map(([platform, url]) => ({ platform: platform as 'instagram' | 'linkedin' | 'behance' | 'dribbble', url: url! }));

  const getSocialIcon = (platform: string) => {
    const iconClass = "size-4";
    switch (platform) {
      case 'instagram': return <Instagram className={iconClass} />;
      case 'linkedin': return <Linkedin className={iconClass} />;
      case 'twitter': return <TwitterIcon className={iconClass} />;
      case 'youtube': return <Youtube className={iconClass} />;
      case 'facebook': return <Facebook className={iconClass} />;
      case 'tiktok': return <TikTokIcon className={iconClass} />;
      case 'pinterest': return <PinterestIcon className={iconClass} />;
      case 'github': return <Github className={iconClass} />;
      case 'behance': return <BehanceIcon className={iconClass} />;
      case 'dribbble': return <DribbbleIcon className={iconClass} />;
      default: return null;
    }
  };

  return (
    <footer className="relative border-t border-foreground/5">
      <div className="max-w-6xl mx-auto px-8 lg:px-12 py-16">
        <div className="flex flex-col items-center text-center space-y-10">
          
          {/* Personal Message */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-2xl font-light text-foreground/80 tracking-wide max-w-md"
          >
            Let's create something meaningful together.
          </motion.p>

          {/* Social Links */}
          {showSocialLinks && footerSocialLinks.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-6"
            >
              {footerSocialLinks.map((link, index) => (
                <motion.a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-all duration-300"
                  aria-label={link.platform}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + (index * 0.05) }}
                >
                  {getSocialIcon(link.platform)}
                </motion.a>
              ))}
            </motion.div>
          )}

          {/* Divider */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-16 h-px bg-foreground/10"
          />

          {/* Brand + Copyright */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            <Link to="/" className="transition-opacity hover:opacity-70">
              {useLogo ? (
                <img 
                  src={logoUrl} 
                  alt={name} 
                  className={cn(logoSizeClasses[footerLogoSize], "w-auto object-contain")}
                />
              ) : (
                <span className="text-xs font-light tracking-[0.25em] uppercase text-foreground/60">
                  {name}
                </span>
              )}
            </Link>
            <p className="text-xs text-muted-foreground/60 font-light tracking-wider">
              {copyrightText}
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}