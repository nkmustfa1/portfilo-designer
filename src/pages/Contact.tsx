import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useDesignerInfo } from '@/hooks/useSiteSettings';
import { photographerInfo } from '@/data/photographer';
import { ContactForm } from '@/components/forms/ContactForm';
import { SEOHead } from '@/components/seo/SEOHead';
import { LoadingFallback } from '@/components/ui/LoadingFallback';
import { GlassBackground, GlassCard } from '@/components/ui/GlassBackground';

/**
 * Editorial Contact page with scroll-based animations
 */
export default function Contact() {
  const { data: designerInfo, isLoading } = useDesignerInfo();

  if (isLoading) {
    return <LoadingFallback />;
  }

  const name = designerInfo?.name || photographerInfo.name;
  const email = designerInfo?.email || photographerInfo.email;
  const location = designerInfo?.location || photographerInfo.location;
  const availability = designerInfo?.availability || photographerInfo.availability;

  const contactDetails = [
    { label: 'Email', value: email, isLink: true },
    { label: 'Based in', value: location },
    { label: 'Availability', value: availability }
  ];

  return (
    <>
      <SEOHead
        title="Contact"
        description={`Get in touch with ${name} for design inquiries and collaborations. ${availability}`}
      />
      
      <div className="min-h-screen relative overflow-hidden">
        {/* Mobile fast background */}
<div className="mobile-brand-bg md:hidden absolute inset-0 z-0" />

        {/* Glass Background Effect with Brand Pattern */}
      <div className="hidden md:block">
  <GlassBackground variant="hero" />
</div>

        {/* Hero Section */}
        <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-8 lg:px-20 relative" style={{ zIndex: 1 }}>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
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
                Contact
              </motion.span>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-foreground"
              >
                Let's work together.
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl text-muted-foreground font-light max-w-xl"
              >
                Have a project in mind? I'd love to hear about it. Send me a message and let's create something meaningful.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 md:py-32 px-8 lg:px-20 border-t border-foreground/10 relative" style={{ zIndex: 1 }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-20 lg:gap-32">
              {/* Contact Info - Glass Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-2"
              >
                <GlassCard className="p-8 space-y-12">
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
                      className="w-12 h-px bg-foreground/20 origin-left"
                    />
                    <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                      Details
                    </span>
                  </motion.div>

                  <div className="space-y-10">
                    {contactDetails.map((detail, index) => (
                      <motion.div
                        key={detail.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {detail.label}
                        </p>
                        {detail.isLink ? (
                          <a
                            href={`mailto:${detail.value}`}
                            className="text-lg font-light text-foreground hover:opacity-70 transition-opacity"
                          >
                            {detail.value}
                          </a>
                        ) : (
                          <p className="text-lg font-light text-foreground">
                            {detail.value}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="pt-10 border-t border-foreground/10"
                  >
                    <p className="text-sm text-muted-foreground font-light">
                      I typically respond within 24–48 hours.
                    </p>
                  </motion.div>
                </GlassCard>
              </motion.div>

              {/* Contact Form - Glass Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="lg:col-span-3"
              >
                <GlassCard className="p-8">
                  <motion.div 
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="flex items-center gap-6 mb-12"
                  >
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="w-12 h-px bg-foreground/20 origin-left"
                    />
                    <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                      Send a Message
                    </span>
                  </motion.div>

                  <ContactForm />
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bottom Section - Glass Effect */}
        <section className="py-32 md:py-48 px-8 lg:px-20 border-t border-foreground/10 relative" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <GlassCard className="p-12 space-y-8">
              <p className="text-sm text-muted-foreground uppercase tracking-[0.2em]">
                Prefer email?
              </p>
              <motion.a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-3 text-2xl md:text-3xl font-light text-foreground hover:opacity-70 transition-opacity group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{email}</span>
                <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </GlassCard>
          </motion.div>
        </section>
      </div>
    </>
  );
}