import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { photographerInfo } from '@/data/photographer';
import { cn } from '@/lib/utils';
import { useDesignerInfo, useBrandSettings } from '@/hooks/useSiteSettings';
import { useLanguage } from "@/context/LanguageContext";

const navLinks = [
  { en: "Work", ar: "الرئيسية", path: "/" },
  { en: "Portfolio", ar: "الأعمال", path: "/portfolio" },
  { en: "About", ar: "من أنا", path: "/about" },
  { en: "Contact", ar: "تواصل", path: "/contact" },
];



/**
 * NavLink component with elegant hover animation
 * Uses CSS pseudo-element for underline effect
 */
function NavLink({ 
  link, 
  lang,
  isActive, 
  isTransparent 
}: { 
  link: { en: string; ar: string; path: string }; 
  lang: "en" | "ar";
  isActive: boolean; 
  isTransparent: boolean;
}) {


  return (
    <Link
      to= {link.path}

      className={cn(
        "nav-link-hover relative py-2 text-sm font-light tracking-[0.15em] uppercase transition-colors duration-300",
        isTransparent
          ? "text-white/80 hover:text-white"
          : "text-muted-foreground hover:text-foreground",
        isActive && (isTransparent ? "text-white" : "text-foreground"),
        isActive && "nav-link-active"
      )}
      data-transparent={isTransparent}
    >
      {lang === "ar" ? link.ar : link.en}
     
    </Link>
  );
}

function MobileMenuButton({
  side,
  mobileMenuOpen,
  setMobileMenuOpen,
  lang,
  toggleLang,
  location,
  children,
}: {
  side: "left" | "right";
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  lang: "en" | "ar";
  toggleLang: () => void;
  location: ReturnType<typeof useLocation>;
  children: React.ReactNode;
}) 
 {
  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      <SheetContent
  side={side}
  className="w-full sm:w-80 bg-background border-foreground/5"
>
  {/* زر تغيير اللغة */}
  <button
    onClick={() => {
      toggleLang();
      setMobileMenuOpen(false);
    }}
    className="text-sm tracking-wide uppercase text-muted-foreground hover:text-foreground"
  >
    {lang === "en" ? "العربية" : "English"}
  </button>

  {/* روابط القائمة */}
  <nav className="flex flex-col gap-8 mt-16">
    {navLinks.map((link, index) => (
      <motion.div
        key={link.path}
        initial={{ opacity: 0, x: side === "right" ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 * index }}
      >
        <Link
          to={link.path}
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "text-2xl font-light tracking-wide transition-opacity duration-300",
            lang === "ar" ? "text-right" : "text-left",
            location.pathname === link.path
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {lang === "ar" ? link.ar : link.en}
        </Link>
      </motion.div>
    ))}
  </nav>
</SheetContent>

    </Sheet>
  );
}
/**
 * Main header component with scroll-aware styling
 * Transparent on hero section, solid when scrolled
 * Mobile responsive with hamburger menu
 */
export function Header() {
  const location = useLocation();
  const { isScrolled } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: designerInfo } = useDesignerInfo();
  const { data: brandSettings } = useBrandSettings();
  const { lang, toggleLang } = useLanguage();

  const name = designerInfo?.name || photographerInfo.name;
  const useLogo = brandSettings?.useLogo && brandSettings?.logoUrl;
  const logoUrl = brandSettings?.logoUrl;
  const headerLogoSize = brandSettings?.headerLogoSize || 'medium';
  
  const logoSizeClasses = {
    small: 'h-5',
    medium: 'h-6',
    large: 'h-8'
  };
  
  // Header is transparent only on homepage hero when not scrolled
  const isTransparent = location.pathname === '/' && !isScrolled;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isTransparent
          ? 'bg-transparent'
          : 'bg-background/80 backdrop-blur-md border-b border-foreground/5'
      )}
    >
      <div className="max-w-6xl mx-auto px-8 lg:px-12">
       <div className="flex items-center h-20 md:justify-between">



        
          {/* Desktop Navigation */}
<nav className="hidden md:flex items-center gap-10">
  <div
    className={cn(
      "flex items-center gap-10",
      lang === "ar" ? "text-right" : "text-left",

      
    )}
  >
    {navLinks.map((link) => (
      <NavLink
        key={link.path}
        link={link}
        lang={lang}
        isActive={location.pathname === link.path}
        isTransparent={isTransparent}
        
      />
    ))}
  </div>

  <button
    onClick={toggleLang}
    className={cn(
      "text-xs tracking-[0.15em] uppercase transition-opacity",
      isTransparent
        ? "text-white/70 hover:text-white"
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {lang === "en" ? "AR" : "EN"}
  </button>
</nav>

          {/* Mobile Menu */}

<div className="flex w-full items-center md:hidden">

  {/* LEFT */}
  {lang === "en" ? (
    <MobileMenuButton
      side="left"
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      lang={lang}
      toggleLang={toggleLang}
      location={location}
    >
      <Button variant="ghost" size="icon">
        <Menu className="size-5" />
      </Button>
    </MobileMenuButton>
  ) : (
    <Link to="/" className="flex items-center">
      {useLogo ? (
        <img
          src={logoUrl}
          alt={name}
          className={logoSizeClasses[headerLogoSize]}
        />
      ) : (
        <span>{name}</span>
      )}
    </Link>
  )}

  {/* SPACER (هذا هو السر ✨) */}
  <div className="flex-1" />

  {/* RIGHT */}
  {lang === "ar" ? (
    <MobileMenuButton
      side="right"
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      lang={lang}
      toggleLang={toggleLang}
      location={location}
    >
      <Button variant="ghost" size="icon">
        <Menu className="size-5" />
      </Button>
    </MobileMenuButton>
  ) : (
    <Link to="/" className="flex items-center">
      {useLogo ? (
        <img
          src={logoUrl}
          alt={name}
          className={logoSizeClasses[headerLogoSize]}
        />
      ) : (
        <span>{name}</span>
      )}
    </Link>
  )}

</div>

        </div>
      </div>
    </motion.header>
  );
}
