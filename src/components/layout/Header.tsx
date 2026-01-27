import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { photographerInfo } from "@/data/photographer";
import { cn } from "@/lib/utils";
import { useDesignerInfo, useBrandSettings } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/context/LanguageContext";

const navLinks = [
  { en: "Work", ar: "الرئيسية", path: "/" },
  { en: "Portfolio", ar: "الأعمال", path: "/portfolio" },
  { en: "About", ar: "من أنا", path: "/about" },
  { en: "Contact", ar: "تواصل", path: "/contact" },
];

function NavLink({
  link,
  lang,
  isActive,
  isTransparent,
}: {
  link: { en: string; ar: string; path: string };
  lang: "en" | "ar";
  isActive: boolean;
  isTransparent: boolean;
}) {
  return (
    <Link
      to={link.path}
      className={cn(
        "relative py-2 text-sm font-light tracking-[0.15em] uppercase transition-colors duration-300",
        isTransparent
          ? "text-white/80 hover:text-white"
          : "text-muted-foreground hover:text-foreground",
        isActive && (isTransparent ? "text-white" : "text-foreground")
      )}
    >
      {lang === "ar" ? link.ar : link.en}
    </Link>
  );
}

function MobileMenu({
  side,
  lang,
  toggleLang,
}: {
  side: "left" | "right";
  lang: "en" | "ar";
  toggleLang: () => void;
}) {
  const location = useLocation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side={side}
        className="w-full sm:w-80 bg-background border-foreground/5"
      >
        <button
          onClick={toggleLang}
          className="text-sm tracking-wide uppercase text-muted-foreground hover:text-foreground"
        >
          {lang === "en" ? "العربية" : "English"}
        </button>

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
                className={cn(
                  "text-2xl font-light transition-opacity",
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

export function Header() {
  const location = useLocation();
  const { isScrolled } = useScrollPosition();
  const { data: designerInfo } = useDesignerInfo();
  const { data: brandSettings } = useBrandSettings();
  const { lang, toggleLang } = useLanguage();

  const name = designerInfo?.name || photographerInfo.name;
  const useLogo = brandSettings?.useLogo && brandSettings?.logoUrl;
  const logoUrl = brandSettings?.logoUrl;
  const headerLogoSize = brandSettings?.headerLogoSize || "medium";

  const logoSizeClasses = {
    small: "h-5",
    medium: "h-6",
    large: "h-8",
  };

  const isTransparent = location.pathname === "/" && !isScrolled;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        isTransparent
          ? "bg-transparent"
          : "bg-background/80 backdrop-blur-md border-b border-foreground/5"
      )}
    >
      <div className="max-w-6xl mx-auto px-8 lg:px-12">
        <div
          className={cn(
            "flex items-center justify-between h-20",
            lang === "ar" ? "flex-row-reverse md:flex-row" : "flex-row"
          )}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {useLogo ? (
              <img
                src={logoUrl}
                alt={name}
                className={logoSizeClasses[headerLogoSize]}
              />
            ) : (
              <span className="text-sm tracking-[0.2em] uppercase">
                {name}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                link={link}
                lang={lang}
                isActive={location.pathname === link.path}
                isTransparent={isTransparent}
              />
            ))}

            <button
              onClick={toggleLang}
              className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground"
            >
              {lang === "en" ? "AR" : "EN"}
            </button>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <MobileMenu
              side={lang === "ar" ? "right" : "left"}
              lang={lang}
              toggleLang={toggleLang}
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
