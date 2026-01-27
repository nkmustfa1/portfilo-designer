import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Linkedin, Youtube, Facebook, Github, ArrowRight } from 'lucide-react';
import { useDesignerInfo, useFooterSettings } from '@/hooks/useSiteSettings';
import { photographerInfo } from '@/data/photographer';
import { SEOHead } from '@/components/seo/SEOHead';
import { LoadingFallback } from '@/components/ui/LoadingFallback';
import { Link } from 'react-router-dom';
import { GlassBackground } from '@/components/ui/GlassBackground';
import { useLanguage } from "@/context/LanguageContext";

const ui = {
  en: {
    about: "About",
    philosophy: "Philosophy",
    approach: "Approach",
    experience: "Experience",
    skills: "Skills",
    awards: "Awards",
    certifications: "Certifications",
    education: "Education",
    availability: "Availability",
    cta: "Have a project in mind?",
    talk: "Let's talk",
  },
  ar: {
    about: "من أنا",
    philosophy: "الفلسفة",
    approach: "المنهج",
    experience: "الخبرات",
    skills: "المهارات",
    awards: "الجوائز",
    certifications: "الشهادات",
    education: "التعليم",
    availability: "التوفر",
    cta: "هل لديك مشروع في ذهنك؟",
    talk: "لنتحدث",
  },
};

const renderMarkdownLite = (text: string) => {
  return text
    .split(/(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .map((part, i) => {
      if (part.startsWith('***')) {
        return <em key={i} className="font-semibold italic">{part.slice(3, -3)}</em>;
      }
      if (part.startsWith('**')) {
        return <strong key={i} className="font-medium">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*')) {
        return <em key={i} className="italic">{part.slice(1, -1)}</em>;
      }
      return <span key={i}>{part}</span>;
    });
};


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

const getSocialIcon = (platform: string) => {
  const iconClass = "size-5";
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

/**
 * Editorial About page with scroll-based animations
 */
export default function About() {
  const { data: designerInfo, isLoading } = useDesignerInfo();
  const { data: footerSettings } = useFooterSettings();
  const containerRef = useRef<HTMLDivElement>(null);
const isMobile = window.innerWidth < 768;
  const { lang } = useLanguage();
const pickLang = (
  value?: string | { en?: string; ar?: string }
): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return lang === "ar"
    ? value.ar || value.en || ""
    : value.en || value.ar || "";
};
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const imageY = useTransform(scrollYProgress, [0, 0.5], ['0%', '15%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [1.05, 1]);

  if (isLoading) {
    return <LoadingFallback />;
  }
  const toText = (value?: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    const v = value as { en?: string; ar?: string };
    return (lang === "ar" ? v.ar : v.en) ?? "";
  }
  return "";
};
  const name = designerInfo?.name || photographerInfo.name;
  const tagline = designerInfo?.tagline || photographerInfo.tagline;
  const biography = designerInfo?.biography || photographerInfo.biography;
const philosophyText = toText(designerInfo?.philosophy || photographerInfo.philosophy);
const approachText = toText(designerInfo?.approach || photographerInfo.approach);
  const portraitImage = designerInfo?.portraitImage || photographerInfo.portraitImage;
  const skills = designerInfo?.skills || photographerInfo.skills;
  const workExperience = designerInfo?.workExperience || photographerInfo.workExperience || [];
  const certifications = designerInfo?.certifications || photographerInfo.certifications || [];
  const education = toText(designerInfo?.education || photographerInfo.education);
  const email = designerInfo?.email || photographerInfo.email;
  const availability = toText(designerInfo?.availability || photographerInfo.availability);
  const footerSocialLinks = footerSettings?.socialLinks || [];


const safeSplit = (value?: unknown, separator = '\n\n'): string[] => {
  if (typeof value !== 'string') return [];
  return value.split(separator);
};
const bioSections = safeSplit(biography);
const philosophySections = safeSplit(philosophyText);
const approachSections = safeSplit(approachText);

  const awards = certifications.filter(c => c.type === 'award');
  const certs = certifications.filter(c => c.type === 'certification');


  return (
    <>
      <SEOHead
        title="about"

        description={`Learn about ${name}, ${tagline}. ${bioSections[0]}`}
        image={portraitImage}
      />
      
     <div
  ref={containerRef}
  dir={lang === "ar" ? "rtl" : "ltr"}
  className="min-h-screen relative overflow-hidden"
>

        {/* Mobile fast background */}
<div className="mobile-brand-bg md:hidden absolute inset-0 z-0" />

        {/* Glass Background Effect with Brand Pattern */}
       <div className="hidden md:block">
  <GlassBackground variant="hero" />
</div>

        {/* Hero Section */}
        <section className="relative min-h-screen grid lg:grid-cols-2" style={{ zIndex: 1 }}>
          <motion.div 
            className="relative h-[50vh] lg:h-screen overflow-hidden"
style={isMobile ? {} : { y: imageY }}          >
            <motion.img
              src={portraitImage}
              alt={`Portrait of ${name}`}
              className="w-full h-full object-cover transition-all duration-700"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
  style={isMobile ? {} : { scale: imageScale }}
              transition={{ duration: 1.2 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/90 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:hidden" />
          </motion.div>

          <div className="relative flex items-center px-8 lg:px-20 py-20 lg:py-0">
            <div className="max-w-xl space-y-10">
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
                className="block text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground"
              >
               {ui[lang].about}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-foreground"
              >
              {renderMarkdownLite(toText(designerInfo?.heroQuote))}

              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg text-muted-foreground font-light leading-relaxed"
              >
                {bioSections[0]}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        {philosophySections.length > 0 && (
          <section className="py-32 md:py-48 px-8 lg:px-20 relative" style={{ zIndex: 1 }}>
            <div className="max-w-3xl mx-auto space-y-16">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex items-center gap-6"
              >
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="w-16 h-px bg-foreground/20 origin-left"
                />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                 {ui[lang].philosophy}


                </span>
              </motion.div>

              <div className="space-y-10">
                {philosophySections.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: index * 0.15, duration: 0.7 }}
                    className="text-xl md:text-2xl font-light leading-relaxed text-foreground/80"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Approach Section */}
        {approachText && (
          <section className="py-32 md:py-48 px-8 lg:px-20 border-t border-foreground/10 relative" style={{ zIndex: 1 }}>
            <div className="max-w-3xl mx-auto space-y-16">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex items-center gap-6"
              >
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="w-16 h-px bg-foreground/20 origin-left"
                />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  {ui[lang].approach}

                </span>
              </motion.div>

              <div className="space-y-10">
                {approachSections.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: index * 0.15, duration: 0.7 }}
                    className="text-xl md:text-2xl font-light leading-relaxed text-foreground/80"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Work Experience Section */}
        {workExperience.length > 0 && (
          <section className="py-32 md:py-48 px-8 lg:px-20 border-t border-foreground/10 relative" style={{ zIndex: 1 }}>
            <div className="max-w-3xl mx-auto space-y-16">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex items-center gap-6"
              >
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="w-16 h-px bg-foreground/20 origin-left"
                />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  {ui[lang].experience}
                </span>
              </motion.div>

              <div className="space-y-12">
                {workExperience.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: index * 0.15, duration: 0.7 }}
                    className="relative pl-8 border-l border-foreground/10"
                  >
                    <div className="absolute left-0 top-0 w-2 h-2 -translate-x-[5px] rounded-full bg-foreground/30" />
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        
                        <h3 className="text-xl font-light text-foreground">{pickLang(exp.role)}</h3>
                        <span className="text-sm text-muted-foreground">
                          {exp.startDate} — {exp.endDate}
                        </span>
                      </div>
                      <p className="text-base font-light text-foreground/60">{pickLang(exp.company)}</p>
                      {exp.description && (
                        <p className="text-base font-light text-foreground/80 mt-4">
                          {pickLang(exp.description)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Certifications & Awards Section */}
        {certifications.length > 0 && (
          <section className="py-32 md:py-48 px-8 lg:px-20 border-t border-foreground/10 relative" style={{ zIndex: 1 }}>
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-20">
                {/* Awards */}
                {awards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-px bg-foreground/20" />
                      <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                        
                        {ui[lang].awards}

                      </span>
                    </div>
                    <div className="space-y-6">
                      {awards.map((award, index) => (
                        <motion.div
                          key={award.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="flex items-start gap-4"
                        >
                          <span className="text-2xl">🏆</span>
                          <div>
                            <h4 className="text-base font-light text-foreground">{pickLang(award.title)}</h4>
                            <p className="text-sm text-muted-foreground">{pickLang(award.issuer)} • {award.year}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Certifications */}
                {certs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-px bg-foreground/20" />
                      <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                        
                         {ui[lang].certifications}

                      </span>
                    </div>
                    <div className="space-y-6">
                      {certs.map((cert, index) => (
                        <motion.div
                          key={cert.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="flex items-start gap-4"
                        >
                          <span className="text-2xl">📜</span>
                          <div>
                           
                            <h4 className="text-base font-light text-foreground">{pickLang(cert.title)}</h4>
                            <p className="text-sm text-muted-foreground"> {pickLang(cert.issuer)} • {cert.year}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Skills, Education & Availability Section */}
        <section className="py-32 md:py-48 px-8 lg:px-20 border-t border-foreground/10 relative" style={{ zIndex: 1 }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-16">
              {/* Skills */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="space-y-8 md:col-span-2"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-px bg-foreground/20" />
                  <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    
                     {ui[lang].skills}

                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className="px-4 py-2 text-sm font-light text-foreground/80 border border-foreground/10 rounded-full hover:border-foreground/30 transition-colors"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Education & Availability */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="space-y-10"
              >
                {education && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-px bg-foreground/20" />
                      <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        
                        {ui[lang].education}
                      </span>
                    </div>
                    <p className="text-base font-light text-foreground/80 pl-14">{education}</p>
                  </div>
                )}
                {availability && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-px bg-foreground/20" />
                      <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        
                         {ui[lang].availability}
                      </span>
                    </div>
                    <p className="text-base font-light text-foreground/80 pl-14">{availability}</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 md:py-48 px-8 lg:px-20 border-t border-foreground/10 relative" style={{ zIndex: 1 }}>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-12"
            >
             <h2 className="text-3xl md:text-4xl font-light text-foreground">
  {ui[lang].cta}
</h2>

              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 text-lg font-light text-foreground hover:opacity-70 transition-opacity group"
                >
                 <span>{ui[lang].talk}</span>

                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <a
                  href={`mailto:${email}`}
                  className="text-lg font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  {email}
                </a>
              </div>

              {footerSocialLinks.length > 0 && (
                <div className="flex items-center gap-6 pt-12">
                  {footerSocialLinks.map((link, index) => (
                    <motion.a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={link.platform}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {getSocialIcon(link.platform)}
                    </motion.a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}